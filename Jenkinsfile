#!groovy

@Library('realm-ci') _

jobWrapper {
  stage('Checkout') {
    node('docker') {
      rlmCheckout scm
    }
  }

  stage('Build & test') {
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
    }
  }
}
