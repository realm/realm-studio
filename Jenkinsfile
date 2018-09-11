#!groovy

@Library('realm-ci') _

jobWrapper {
  node('docker') {
    stage('Checkout') {
      checkout scm
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
          // Remove any node_modules that might already be here
          sh 'rm -rf node_modules'
          // Link in the node_modules from the image
          sh 'ln -s /tmp/node_modules .'
          // Test that the package-lock has changed while building the image
          // - if it has, a dependency was changed in package.json but not updated in the lock
          sh 'npm run check:package-lock'
          // Try running the TS specific linting
          try {
            sh 'npm run lint:ts'
          } catch (err) {
            error "TypeScript code doesn't lint correctly, run `npm run lint:ts` or see detailed output for the errors."
          }
          // Try to build the app
          try {
            sh 'npm run build'
          } catch (err) {
            error "Failed to build the app"
          }
          // Trying to test - but that might fail
          try {
            // Run the tests with xvfb to allow opening windows virtually, and report using the junit reporter
            sh 'npm run test:ci'
          } catch (err) {
            error "Tests failed - see results on CI"
          } finally {
            junit(
              keepLongStdio: true,
              testResults: 'test-results.xml'
            )
          }
        }
      }
    }
  }
}
