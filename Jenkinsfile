#!groovy

def changeVersion(String preId = "") {
  // Determine the upcoming release type
  nextVersionType = sh(
    script: "node ./scripts/next-version.js",
    returnStdout: true,
  ).trim()
  // Ask NPM to update the package json and lock and read the next version
  // If a preid is specified, perform a pre-release afterwards
  if (preId) {
    // Update the version of the package again
    nextVersion = sh(
      script: "npm version pre${nextVersionType} --no-git-tag-version --preid=${preId}",
      returnStdout: true,
    ).trim()
  } else {
    nextVersion = sh(
      script: "npm version ${nextVersionType} --no-git-tag-version",
      returnStdout: true,
    ).trim()
  }
  // Set the build name
  currentBuild.displayName += ": ${nextVersion}"
  return nextVersion
}

def copyReleaseNotes(versionBefore, versionAfter) {
  // Read the release notes and replace in any variables
  releaseNotes = readFile 'RELEASENOTES.md'
  releaseNotes = releaseNotes
    .replaceAll("\\{PREVIOUS_VERSION\\}", versionBefore)
    .replaceAll("\\{CURRENT_VERSION\\}", versionAfter)
  // Write back the release notes
  writeFile file: 'RELEASENOTES.md', text: releaseNotes

  // Get todays date
  today = new Date().format('yyyy-MM-dd')
  // Append the release notes to the change log
  changeLog = readFile 'CHANGELOG.md'
  writeFile(
    file: 'CHANGELOG.md',
    text: "# Release ${versionAfter.substring(1)} (${today})\n\n${releaseNotes}\n\n${changeLog}",
  )
  // Restore the release notes from the template
  sh 'cp docs/RELEASENOTES.template.md RELEASENOTES.md'
}

pipeline {
  agent {
    label 'macos-cph-02.cph.realm'
  }

  environment {
    // Parameters used by the github releases script
    GITHUB_OWNER="realm"
    GITHUB_REPO="realm-studio"
  }

  options {
    // Prevent checking out multiple times
    skipDefaultCheckout()
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
        <p>NOTE: PRs jobs don't get packaged by default, rebuild with this enabled to produce these.</p>
      ''',
    )
    booleanParam(
      name: 'PUBLISH',
      defaultValue: false,
      description: '''
        <p>Publish the packaged artifacts:</p>
        <ol>
          <li>Await user input to allow manual testing of the packaged artifacts.</li>
          <li>Push the version as a tag to GitHub.</li>
          <li>Create a draft GitHub release.</li>
          <li>Upload the packaged artifacts to the draft release.</li>
          <li>Upload the packaged artifacts to S3.</li>
          <li>Upload the auto-updating .yml files to S3.</li>
          <li>Publish the GitHub release.</li>
        </ol>
        <p>NOTE: Enabling this will also produce distribution packages.</p>
        <p>NOTE: This is automatically enabled for builds that change the version in the package.json.</p>
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
          // Was the previous commit tagged to prepare for a release?
          // TODO: Determine if the package version was changed ...
          // Publishing needs some packaged artifacts to publish
          if (PUBLISH == "true") {
            env.PACKAGE = "true"
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
          // Read the current version of the package
          packageJson = readJSON file: 'package.json'
          env.PREVIOUS_VERSION = "v${packageJson.version}"
          if (PUBLISH == "true") {
            // Update the build display name
            currentBuild.displayName += ": ${PREVIOUS_VERSION} (publish)"
          } else if (PREPARE == "true") {
            // Change the version
            nextVersion = changeVersion()
            // Add to the display name of the build job that we're preparing a release
            currentBuild.displayName += " (prepare)"
          } else {
            // Change the version to a prerelease if it's not preparing or is a release
            changeVersion "${JOB_BASE_NAME}-${BUILD_NUMBER}"
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
          steps {
            // Remove any node_modules that might already be here
            sh 'rm -rf node_modules'
            // Link in the node_modules from the image
            sh 'ln -s /tmp/node_modules .'
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
              sh 'npx build -mlw -c.forceCodeSigning  --publish never'
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

    stage('Publish') {
      when {
        environment name: 'PUBLISH', value: 'true'
      }
      steps {
        /*
        withCredentials([
          string(credentialsId: 'github-release-token', variable: 'GITHUB_TOKEN')
        ]) {
          // Create a draft release on GitHub
          sh "node scripts/github-releases create-draft $nextVersion RELEASENOTES.md"
          // Upload artifacts to GitHub
          script {
            for (file in findFiles(glob: 'dist/*')) {
              sh "node scripts/github-releases upload-asset $TAG_NAME $file"
            }
          }
          // Publish the release
          sh "node scripts/github-releases publish $TAG_NAME"
        }
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
        PREPARED_BRANCH = "ci/prepared-${nextVersion}"
      }
      steps {
        // Append the RELEASENOTES to the CHANGELOG
        script {
          copyReleaseNotes(PREVIOUS_VERSION, nextVersion)
        }

        // Set the email and name used when committing
        sh 'git config --global user.email "ci@realm.io"'
        sh 'git config --global user.name "Jenkins CI"'

        // Checkout a branch
        sh "git checkout -b ${PREPARED_BRANCH}"

        // Stage the updates to the files, commit and tag the commit
        sh 'git add package.json package-lock.json CHANGELOG.md RELEASENOTES.md'
        sh "git commit -m 'Prepare version ${nextVersion}'"

        // Push to GitHub with tags
        sshagent(['realm-ci-ssh']) {
          sh "git push --set-upstream --tags --force origin ${PREPARED_BRANCH}"
        }

        // Create a pull-request
        withCredentials([
          string(credentialsId: 'github-release-token', variable: 'GITHUB_TOKEN')
        ]) {
          // Create a draft release on GitHub
          sh "node scripts/github-releases create-pull-request ${PREPARED_BRANCH} ${BRANCH_NAME} 'Preparing ${nextVersion} release'"
        }
      }
    }
  }
}
