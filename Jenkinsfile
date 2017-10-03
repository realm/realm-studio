#!groovy

node('macos') {
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
    def nodeVersion = readFile('.nvmrc').trim()
    nvm(version: nodeVersion) {
      sh '''
        npm install --quiet
        npm run build
      '''
    }
  }

  if (env.BRANCH_NAME == "master") {
    stage('Publish') {
      // eletron-build check credentials even for --publish never, so will always specify it.
      withCredentials([
        [$class: 'StringBinding', credentialsId: 'github-release-token', variable: 'GH_TOKEN'],
        [$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-s3-user-key', accessKeyVariable: 'AWS_ACCESS_KEY_ID', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']
      ]) {
        sh './node_modules/.bin/electron-builder --publish onTagOrDraft'
      }

      archiveArtifacts "dist/*.zip"
    }
  }
}