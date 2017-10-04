#!groovy

@Library('realm-ci') _

if (env.BRANCH_NAME == 'master') {
  node('macos') {
    stage('Checkout') {
      rlmCheckout scm
    }

    stage('Build') {
      def nodeVersion = readFile('.nvmrc').trim()
      nvm(version: nodeVersion) {
        sh '''
          npm install --quiet
          npm run build
        '''
      }
    }

    stage('Publish') {
      // eletron-build check credentials even for --publish never, so will always specify it.
      withCredentials([
        [$class: 'StringBinding', credentialsId: 'github-release-token', variable: 'GH_TOKEN'],
        [$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-s3-user-key', accessKeyVariable: 'AWS_ACCESS_KEY_ID', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']
      ]) {
        sh './node_modules/.bin/electron-builder --publish onTagOrDraft'
      }

      archiveArtifacts 'dist/*.zip'
    }
  }
} else {
  node('docker') {
    stage('Checkout') {
      rlmCheckout scm
    }

    stage('Build and test') {
      // Computing a packageHash from the package-lock.json
      packageHash = sh('git ls-files -s package-lock.json | cut -d ' ' -f 2', returnStdout: true)
      // Using buildDockerEnv ensures that the image is pushed
      buildDockerEnv("ci/realm-studio:pr-${packageHash}", extra_args: '-f Dockerfile.testing')
        .inside('-e HOME=/tmp -v /etc/passwd:/etc/passwd:ro') {
          sh 'ln -s /tmp/node_modules .'
          sh './node_modules/.bin/xvfb-maybe npm test'
        }
    }
  }
}
