#!groovy

@Library('realm-ci') _

jobWrapper {
  node('docker') {
    stage('Checkout') {
      rlmCheckout scm
    }

    if (env.CHANGE_TARGET) {
      stage('Build') {
        // Computing a packageHash from the package-lock.json
        def packageHash = sh(
          script: "git ls-files -s package-lock.json | cut -d ' ' -f 2",
          returnStdout: true
        ).trim()
        // Using buildDockerEnv ensures that the image is pushed
        image = buildDockerEnv("ci/realm-studio:pr-${packageHash}", extra_args: '-f Dockerfile.testing')
      }

      stage('Test') {
        image.inside("-e HOME=${env.WORKSPACE} -v /etc/passwd:/etc/passwd:ro") {
          // Link in the node_modules from the image
          sh 'ln -s /tmp/node_modules .'
          // Test that the package-lock has changed while building the image
          // - if it has, a dependency was changed in package.json but not updated in the lock
          sh 'npm run check:package-lock'
          // Trying to test - but that might fail
          try {
            // Run the tests with xvfb to allow opening windows virtually, and report using the junit reporter
            sh './node_modules/.bin/xvfb-maybe npm run test:ci'
          } catch (err) {
            error "Tests failed - see results on CI"
          } finally {
            junit(
              allowEmptyResults: true,
              keepLongStdio: true,
              testResults: 'test-results.xml'
            )
          }
        }
      }
    }
  }
}
