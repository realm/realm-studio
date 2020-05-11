#!groovy

@Library('realm-ci') _

pipeline {
  agent {
    label 'osx'
  }

  options {
    // Prevent checking out multiple times
    skipDefaultCheckout()
  }

  environment {
    // Parameters used by the github releases script
    GITHUB_OWNER='realm'
    GITHUB_REPO='realm-studio'
    NODE_VERSION='10'
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
      when { not { branch 'ci/prepared-*' } }
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
          def isReleasableBranch = BRANCH_NAME == 'master' || BRANCH_NAME.startsWith('channel/');
          if (isReleasableBranch && previousVersion != packageJson.version) {
            sh "git tag -a ${VERSION} -m 'Release ${packageJson.version}'"
            // Push to GitHub with tags
            sshagent(['realm-ci-ssh']) {
              sh 'git push origin --tags'
            }
          }
          // Determine what tags are pointing at the current commit
          def tagName = sh(
            script: 'git tag --points-at HEAD',
            returnStdout: true,
          ).trim()
          // Publish if the tag starts with a "v"
          if (tagName && tagName.startsWith('v')) {
            // Assert that the tag matches the version in the package.json
            assert "v${packageJson.version}" == tagName : "Tag doesn't match package.json version"
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
      when { not { branch 'ci/prepared-*' } }
      steps {
        nvm(env.NODE_VERSION) {
          // Install dependencies
          sh 'npm ci'
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
                  script: "npm version ${NEXT_VERSION}-${BUILD_TAG} --no-git-tag-version",
                  returnStdout: true,
                ).trim()
                // Set the build display name
                currentBuild.displayName += ": ${NEXT_VERSION}"
              }
            }
          }
        }
      }
    }

    stage('Build, lint & check') {
      when {
        // Don't do this when preparing for a release
        not { environment name: 'PREPARE', value: 'true' }
        not { branch 'ci/prepared-*' }
      }
      parallel {
        stage('Build') {
          steps {
            nvm(env.NODE_VERSION) {
              sh 'npm run build'
            }
          }
        }

        stage('Lint TypeScript') {
          steps {
            nvm(env.NODE_VERSION) {
              sh 'npm run lint:ts'
            }
          }
        }

        stage('Lint SASS') {
          steps {
            nvm(env.NODE_VERSION) {
              sh 'npm run lint:sass'
            }
          }
        }

        stage('Check package-lock') {
          steps {
            nvm(env.NODE_VERSION) {
              sh 'npm run check:package-lock'
            }
          }
        }
      }
    }

    stage('Pre-package tests') {
      when {
        // Don't do this when preparing for a release
        not { environment name: 'PREPARE', value: 'true' }
        not { branch 'ci/prepared-*' }
      }
      steps {
        // Run the tests with the JUnit reporter
        nvm(env.NODE_VERSION) {
          sh 'SPECTRON_LOG_FILE=spectron.log MOCHA_FILE=pre-test-results.xml npm test -- --reporter mocha-junit-reporter'
        }
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
          // Print the STDOUT produced while running the Spectron tests
          sh 'cat spectron.log || true'
        }
      }
    }

    stage('Package') {
      when {
        environment name: 'PACKAGE', value: 'true'
        not { branch 'ci/prepared-*' }
      }
      stages {
        stage("Electron build") {
          steps {
            // Run the electron builder
            nvm(env.NODE_VERSION) {
              withCredentials([
                file(credentialsId: 'cose-sign-certificate-windows', variable: 'WIN_CSC_LINK'),
                string(credentialsId: 'cose-sign-password-windows', variable: 'WIN_CSC_KEY_PASSWORD')
              ]) {
                sh 'npx electron-builder -mlw -c.forceCodeSigning --publish never'
              }
              // Archive the packaged artifacts
              archiveArtifacts 'dist/*'
            }
          }
        }
        stage('Post-packaging tests') {
          steps {
            nvm(env.NODE_VERSION) {
              // Run the tests with the JUnit reporter
              sh 'MOCHA_FILE=post-test-results.xml npm run test:post-package -- --reporter mocha-junit-reporter'
            }
          }
          post {
            always {
              // Archive the test results
              junit(
                allowEmptyResults: true,
                keepLongStdio: true,
                testResults: 'post-test-results.xml'
              )
            }
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
        nvm(env.NODE_VERSION) {
          // Wait for input
          input(message: "Ready to publish $VERSION?", id: 'publish')
          // Extract release notes from the changelog
          sh "node scripts/tools extract-release-notes ./RELEASENOTES.extracted.md"
          // Handle GitHub release
          withCredentials([
            string(credentialsId: 'github-release-token', variable: 'GITHUB_TOKEN')
          ]) {
            // Create a draft release on GitHub
            sh "node scripts/github-releases create-draft $VERSION RELEASENOTES.extracted.md"
            // Delete all the unpackaged directories
            sh 'rm -rf dist/*/'
            // Move yml files to another folder and upload them after other archives.
            // This is to prevent clients from trying to upgrade before the files are there.
            sh 'mkdir dist-finally && mv dist/*.yml dist-finally'
            // Upload artifacts to GitHub
            script {
              for (file in findFiles(glob: 'dist/*')) {
                sh "node scripts/github-releases upload-asset $VERSION '$file'"
              }
            }
            // Upload the build artifacts to S3
            script {
              def s3Config = packageJson.build.publish[0]
              dir('dist') {
                rlmS3Put(bucket: s3Config.bucket, path: s3Config.path)
              }
              // Upload the json and yml files
              dir('dist-finally') {
                rlmS3Put(bucket: s3Config.bucket, path: s3Config.path)
              }
            }
            // Publish the release
            sh "node scripts/github-releases publish $VERSION"
          }
          // Post success message to Slack
          script {
            // Read in the extracted release notes
            def releaseNotes = readFile "./RELEASENOTES.extracted.md"
            def releaseUrl = "https://github.com/$GITHUB_OWNER/$GITHUB_REPO/releases/tag/$VERSION"
            // Post to Slack
            postToSlack('slack-releases-webhook', [[
              'title': "Realm Studio $VERSION has been released!",
              'title_link': releaseUrl,
              'text': "Github Release and artifacts are available <${releaseUrl}|here>\n${releaseNotes}",
              'mrkdwn_in': ['text'],
              'color': 'good',
              'unfurl_links': false
            ]])
          }
        }
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
        nvm(env.NODE_VERSION) {
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
            script {
              // Determine who started the build and should therefore be assigned the pull request.asSynchronized()
              // This assumes they have the same Jenkins user ID as their GitHub handle
              def assignee = currentBuild.rawBuild.getCause(hudson.model.Cause$UserIdCause).getUserId()
              // Create a draft release on GitHub
              def prId = sh(
                script: "node scripts/github-releases create-pull-request ${PREPARED_BRANCH} master 'Prepare version ${NEXT_VERSION}' --assignee ${assignee} --reviewer bmunkholm --print-number",
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
  }
}
