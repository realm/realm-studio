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
    sh '''
      npm run release
    '''
  }
}
