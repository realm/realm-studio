#!groovy

@Library('realm-ci') _

node('docker') {
  rlmCheckout scm
}

parallel (
  linux: build('docker'),
  macos: build('macos'),
  windows: build('windows')
)

/*
if (env.BRANCH_NAME == 'master') {
  parallel (
    linux: { node('docker') { buildInDocker() } },
    macos: { node('macos') { build() } },
    windows: { node('windows') { build() } }
  )
} else {
  node('docker') {
    stage('Checkout') {
      rlmCheckout scm
    }

    def image

    stage('Docker Build') {
      // Computing a packageHash from the package-lock.json
      def packageHash = sh(
        script: "git ls-files -s package-lock.json | cut -d ' ' -f 2",
        returnStdout: true
      ).trim()
      // Using buildDockerEnv ensures that the image is pushed
      image = buildDockerEnv("ci/realm-studio:pr-${packageHash}", extra_args: '-f Dockerfile.testing')
    }

    stage('Test') {
      image.inside('-e HOME=/tmp -v /etc/passwd:/etc/passwd:ro') {
        // Link in the node_modules from the image
        sh 'ln -s /tmp/node_modules .'
        // Test that the package-lock has changed while building the image
        // - if it has, a dependency was changed in package.json but not updated in the lock
        sh 'npm run check:package-lock'
        // Run the tests with xvfb to allow opening windows virtually
        sh './node_modules/.bin/xvfb-maybe npm test'
      }
    }
  }
}
*/

def build(String label) {
  return {
    node(label) {
      rlmCheckout scm
      runTests(label, 'npm build')
    }
  }
}

def runTests(String label, String command) {
  "runTestsOn${label.capitalize()}"(command)
}

def runTestsOnDocker(String command) {
  // Computing a packageHash from the package-lock.json
  def packageHash = sh(
    script: "git ls-files -s package-lock.json | cut -d ' ' -f 2",
    returnStdout: true
  ).trim()
  // Using buildDockerEnv ensures that the image is pushed
  image = buildDockerEnv("ci/realm-studio:pr-${packageHash}", extra_args: '-f Dockerfile.testing')

  image.inside('-e HOME=/tmp -v /etc/passwd:/etc/passwd:ro') {
    // Link in the node_modules from the image
    sh 'ln -s /tmp/node_modules .'
    // Test that the package-lock has changed while building the image
    // - if it has, a dependency was changed in package.json but not updated in the lock
    sh 'npm run check:package-lock'
    // Run the tests with xvfb to allow opening windows virtually
    sh script:command
  }
}

def runTestsOnMacos(String command) {
  def nodeVersion = readFile('.nvmrc').trim()
  nvm(version: nodeVersion) {
    sh 'npm install --quiet'
    sh script: command
  }
}

def runTestsOnWindows(String command) {
  bat 'npm install --quiet'
  bat command
}


