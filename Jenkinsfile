#!groovy

pipeline {
  agent {
    label 'macos-cph-02.cph.realm'
  }

  options {
    // Prevent checking out multiple times
    skipDefaultCheckout()
  }

  environment {
    // Parameters used by the github releases script
    GITHUB_OWNER="realm"
    GITHUB_REPO="realm-studio"
  }

  parameters {
    booleanParam(
      name: 'PREPARE',
      defaultValue: false,
      description: '''
        <p>Prepare for publishing:</p>
        <ol>
          <li>Changes version based on release notes.</li>
          <li>Copies release notes to changelog.</li>
          <li>Restores the release notes from a template.</li>
          <li>Commits the changes to a branch and pushes it to GitHub.</li>
          <li>Creates a pull-request from the branch into master.</li>
        </ol>
      ''',
    )
    booleanParam(
      name: 'PACKAGE',
      defaultValue: false,
      description: '''
        <p>Produce packaged artifacts for all supported platforms.</p>
        <p>NOTE: PRs jobs don't get packaged by default, rebuild with this enabled to produce packages.</p>
      ''',
    )
  }

  stages {
    stage('Checkout') {
      steps {
        checkout([
          $class: 'GitSCM',
          branches: scm.branches,
          extensions: scm.extensions + [
            [$class: 'WipeWorkspace'],
            [$class: 'CleanCheckout'],
            [$class: 'LocalBranch']
          ],
          userRemoteConfigs: [[
            credentialsId: 'realm-ci-ssh',
            name: 'origin',
            url: "git@github.com:${GITHUB_OWNER}/${GITHUB_REPO}.git"
          ]]
        ])
        script {
          // Read the current version of the package
          packageJson = readJSON file: 'package.json'
          env.VERSION = "v${packageJson.version}"
          // Determine if this commit changes the version, if so:
          previousVersion = sh(
            script: 'git show HEAD~1:package.json | jq -r .version',
            returnStdout: true,
          ).trim()
          // Did the version change?
          if (BRANCH_NAME == 'master' && previousVersion != packageJson.version) {
            sh "git tag -a ${VERSION} -m 'Release ${packageJson.version}'"
            // Push to GitHub with tags
            sshagent(['realm-ci-ssh']) {
              sh 'git push origin --tags'
            }
          }
          // Determine what tags are pointing at the current commit
          env.TAG_NAME = sh(
            script: 'git tag --points-at HEAD',
            returnStdout: true,
          ).trim()
          // Publish if the tag starts with a "v"
          if (TAG_NAME && TAG_NAME.startsWith('v')) {
            // Assert that the tag matches the version in the package.json
            assert "v${packageJson.version}" == env.TAG_NAME : "Tag doesn't match package.json version"
            // Package and publish when building a version tag
            env.PUBLISH = 'true'
            env.PACKAGE = 'true'
          } else {
            env.PUBLISH = 'false'
          }
        }
      }
    }

    stage('Install & update version') {
      steps {
        // Install dependencies
        sh 'npm install'
        // Update the version
        script {
          if (PUBLISH == 'true') {
            // Update the build display name
            currentBuild.displayName += ": ${VERSION} (publish)"
          } else {
            // Determine the upcoming release type
            nextVersionType = sh(
              script: "node ./scripts/next-version.js",
              returnStdout: true,
            ).trim()
            // Bump the version accordingly
            env.NEXT_VERSION = sh(
              script: "npm version ${nextVersionType} --no-git-tag-version",
              returnStdout: true,
            ).trim()
            // If we're preparing, add this to the display name .. alternatively add a pre-release id
            if (env.PREPARE == 'true') {
              // Set the build display name
              currentBuild.displayName += ": ${NEXT_VERSION} (prepare)"
            } else {
              // Update the version of the package again, this time prepending pre release id
              env.NEXT_VERSION = sh(
                script: "npm version ${NEXT_VERSION}-${JOB_BASE_NAME}-${BUILD_NUMBER} --no-git-tag-version",
                returnStdout: true,
              ).trim()
              // Set the build display name
              currentBuild.displayName += ": ${NEXT_VERSION}"
            }
          }
        }
      }
    }

    stage('Build, lint & check') {
      when {
        // Don't do this when preparing for a release
        not { environment name: 'PREPARE', value: 'true' }
      }
      parallel {
        stage('Build') {
          steps {
            sh 'npm run build'
          }
        }

        stage('Lint TypeScript') {
          steps {
            sh 'npm run lint:ts'
          }
        }

        stage('Lint SASS') {
          steps {
            sh 'npm run lint:sass'
          }
        }

        stage('Check package-lock') {
          steps {
            sh 'npm run check:package-lock'
          }
        }

        stage('Pre-package tests') {
          agent {
            dockerfile {
              filename 'Dockerfile.testing'
              label 'docker'
              // /etc/passwd is mapped so a jenkins users is available from within the container
              // ~/.ssh is mapped to allow pushing to GitHub via SSH
              args '-e "HOME=${WORKSPACE}" -v /etc/passwd:/etc/passwd:ro -v /home/jenkins/.ssh:/home/jenkins/.ssh:ro'
            }
          }
          options {
            skipDefaultCheckout false
          }
          steps {
            // Remove any node_modules that might already be here
            sh 'rm -rf node_modules'
            // Link in the node_modules from the image
            sh 'ln -s /tmp/node_modules .'
            // Build the app for the spectron tests to run
            sh 'npm run build'
            // Run the tests
            sh 'MOCHA_FILE=pre-test-results.xml xvfb-run npm run test:ci'
          }
          post {
            always {
              // Archive the test results
              junit(
                allowEmptyResults: true,
                keepLongStdio: true,
                testResults: 'pre-test-results.xml'
              )
              // Archive any screenshots emitted by failing tests
              archiveArtifacts(
                artifacts: 'failure-*.png',
                allowEmptyArchive: true,
              )
            }
          }
        }
      }
    }

    stage('Package') {
      when {
        environment name: 'PACKAGE', value: 'true'
      }
      stages {
        stage("Electron build") {
          steps {
            // Run the electron builder
            withCredentials([
              file(credentialsId: 'cose-sign-certificate-windows', variable: 'WIN_CSC_LINK'),
              string(credentialsId: 'cose-sign-password-windows', variable: 'WIN_CSC_KEY_PASSWORD')
            ]) {
              sh 'npx build -mlw -c.forceCodeSigning --publish never'
            }
            // Archive the packaged artifacts
            archiveArtifacts 'dist/*'
          }
        }
        stage('Post-packaging tests') {
          steps {
            println "Lacking post-package tests ..."
          }
        }
      }
    }

    /*
     * Publish the packaged artifacts:
     * - Await user input to allow manual testing of the packaged artifacts.
     * - Extract the latest release notes from the changelog.
     * - Create a draft GitHub release.
     * - Upload the packaged artifacts to the draft release.
     * - Upload the packaged artifacts to S3.
     * - Upload the auto-updating .yml files to S3.
     * - Publish the GitHub release.
     * - Announce the release on Slack.
     *
     * This stage runs when building a commit tagged with a version.
     */
    stage('Publish') {
      when {
        environment name: 'PUBLISH', value: 'true'
      }
      steps {
        // Wait for input
        input(message: "Ready to publish ${VERSION}?", id: 'publish')
        // Extract release notes from the changelog
        sh "node scripts/tools extract-release-notes ./RELEASENOTES.extracted.md"
        // Handle GitHub release
        withCredentials([
          string(credentialsId: 'github-release-token', variable: 'GITHUB_TOKEN')
        ]) {
          // Create a draft release on GitHub
          sh "node scripts/github-releases create-draft ${NEXT_VERSION} RELEASENOTES.extracted.md"
          // Delete all the unpackaged directories
          sh 'rm -rf dist/*/'
          // Upload artifacts to GitHub
          script {
            for (file in findFiles(glob: 'dist/*')) {
              sh "node scripts/github-releases upload-asset $TAG_NAME $file"
            }
          }
          // Move yml files to another folder and upload them after other archives.
          // This is to prevent clients from trying to upgrade before the files are there.
          sh 'mkdir dist-finally && mv dist/*.yml dist-finally'
          // Upload the build artifacts to S3
          script {
            def s3Config = packageJson.build.publish[0]
            dir('dist') {
              rlmS3Put(bucket: s3Config.bucket, path: s3Config.path)
            }
            // Upload the json and yml files
            dir('dist-finally') {
              // rlmS3Put(bucket: s3Config.bucket, path: s3Config.path)
            }
          }
          // Publish the release
          // sh "node scripts/github-releases publish $TAG_NAME"
        }
        /*
        // TODO: Annouce this on Slack
        */
        println "Publish!"
      }
    }

    stage('Prepare') {
      when {
        environment name: 'PREPARE', value: 'true'
      }
      environment {
        PREPARED_BRANCH = "ci/prepared-${NEXT_VERSION}"
      }
      steps {
        // Append the RELEASENOTES to the CHANGELOG
        sh "node scripts/tools copy-release-notes ${VERSION} ${NEXT_VERSION}"
        // Restore RELEASENOTES.md from the template
        sh 'cp docs/RELEASENOTES.template.md RELEASENOTES.md'

        // Set the email and name used when committing
        sh 'git config --global user.email "ci@realm.io"'
        sh 'git config --global user.name "Jenkins CI"'

        // Checkout a branch
        sh "git checkout -b ${PREPARED_BRANCH}"

        // Stage the updates to the files, commit and tag the commit
        sh 'git add package.json package-lock.json CHANGELOG.md RELEASENOTES.md'
        sh "git commit -m 'Prepare version ${NEXT_VERSION}'"

        // Push to GitHub with tags
        sshagent(['realm-ci-ssh']) {
          sh "git push --set-upstream --tags --force origin ${PREPARED_BRANCH}"
        }

        // Create a pull-request
        withCredentials([
          string(credentialsId: 'github-release-token', variable: 'GITHUB_TOKEN')
        ]) {
          // Create a draft release on GitHub
          def prId = sh(
            script: "node scripts/github-releases create-pull-request ${PREPARED_BRANCH} master 'Prepare version ${NEXT_VERSION}' --reviewer bmunkholm --print-number",
            returnStdout: true,
          ).trim()
          // Update the description of the build to include a link for the pull request.
          currentBuild.description = """
            Created pull request <a href='https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/pull/${prId}'>#${prId}</a>
          """
        }
      }
    }
  }
}
