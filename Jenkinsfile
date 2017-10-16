#!groovy

@Library('realm-ci') _

jobWrapper {
  stage('SCM') {
    node('docker') {
      rlmCheckout scm
    }
  }

  stage('Build') {
    if (env.CHANGE_TARGET) {
      // This is a PR

      node('docker') {
        rlmCheckout scm

        // Computing a packageHash from the package-lock.json
        def packageHash = sh(
          script: "git ls-files -s package-lock.json | cut -d ' ' -f 2",
          returnStdout: true
        ).trim()

        // Using buildDockerEnv ensures that the image is pushed
        image = buildDockerEnv("ci/realm-studio:pr-${packageHash}", extra_args: '-f Dockerfile.testing')
        image.inside("-e HOME=${env.WORKSPACE} -v /etc/passwd:/etc/passwd:ro") {
          // Link in the node_modules from the image
          sh 'ln -s /tmp/node_modules .'
          // Test that the package-lock has changed while building the image
          // - if it has, a dependency was changed in package.json but not updated in the lock
          sh 'npm run check:package-lock'
          // Run the tests with xvfb to allow opening windows virtually
          sh './node_modules/.bin/xvfb-maybe npm test'
        }
      }
    } else {
      def doRelease = env.BRANCH_NAME == 'releases' || env.BRANCH_NAME.startsWith('release/')
      parallel (
        macos: packageOnMacos(doRelease),
        others: packageOthers(doRelease)
      )
    }
  }
}

def packageOthers(boolean doRelease) {
  return {
    node('docker') {
      rlmCheckout scm

      def workarea = pwd()
      def image = docker.image('electronuserland/builder:wine-chrome')
      image.inside("-e HOME=${workarea}") {
        sh 'npm install'
        sh 'npm run build'

        if (doRelease) {
          // eletron-build check credentials even for --publish never, so will always specify it.
          withCredentials([
            file(credentialsId: 'cose-sign-certificate-windows', variable: 'CSC_LINK'),
            string(credentialsId: 'cose-sign-password-windows', variable: 'CSC_KEY_PASSWORD'),
            string(credentialsId: 'github-release-token', variable: 'GH_TOKEN'),
            [$class: 'AmazonWebServicesCredentialsBinding', accessKeyVariable: 'AWS_ACCESS_KEY_ID', credentialsId: 'aws-s3-user-key', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']])
          {
            sh 'node_modules/.bin/electron-builder --linux --windows --publish always'
          }
        } else {
          sh './node_modules/.bin/xvfb-maybe npm test'
        }
      }

      archiveArtifacts 'dist/*'
    }
  }
}

def packageOnMacos(boolean doRelease) {
  return {
    node('macos') {
      rlmCheckout scm

      def nodeVersion = readFile('.nvmrc').trim()
      nvm(version: nodeVersion) {
        sh 'npm install --quiet'
        sh 'npm run build'

        if (doRelease) {
          withCredentials([
            [$class: 'StringBinding', credentialsId: 'github-release-token', variable: 'GH_TOKEN'],
            [$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-s3-user-key', accessKeyVariable: 'AWS_ACCESS_KEY_ID', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']
          ]) {
            sh 'node_modules/.bin/electron-builder --publish always'
          }

          archiveArtifacts 'dist/*'
        } else {
          sh 'npm run test'
        }
      }
    }
  }
}
