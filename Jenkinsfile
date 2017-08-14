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
      withCredentials([[$class: 'StringBinding', credentialsId: 'github-release-token', variable: 'GH_TOKEN']]) {
        sh '''
          ./node_modules/.bin/build --publish onTagOrDraft
        '''
      }
    }
  }
}
