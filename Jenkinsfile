#!groovy

node('osx_vegas') {
  stage('Checkout') {
    checkout([
      $class: 'GitSCM',
      branches: scm.branches,
      gitTool: 'native git',
      extensions: scm.extensions + [[$class: 'CleanCheckout'], [$class: 'CloneOption', depth: 0, noTags: false, reference: '', shallow: false]],
      userRemoteConfigs: scm.userRemoteConfigs
    ])
  }

  stage('Build') {
    sh '''
      npm install --quiet
      npm run build
    '''
  }

  stage('Publish') {
    if (env.BRANCH_NAME == "master") {
      withCredentials([
        [$class: 'StringBinding', credentialsId: 'github-release-token', variable: 'GH_TOKEN'],
        [$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-ci-user', accessKeyVariable: 'AWS_ACCESS_KEY_ID', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']
      ]) {
        sh './node_modules/.bin/electron-builder --publish onTagOrDraft'
      }
    } else {
      sh './node_modules/.bin/electron-builder --publish never'
    }

    archiveArtifacts "dist/${getPackageBuildProductName()}-${getPackageVersion()}.dmg"
  }
}

def getPackageBuildProductName() {
  return sh(returnStdout: true, script:"node -e \"console.log(require('./package.json').build.productName)\"").trim()
}

def getPackageVersion() {
  return sh(returnStdout: true, script:"node -e \"console.log(require('./package.json').version)\"").trim()
}
