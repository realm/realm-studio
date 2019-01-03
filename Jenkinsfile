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
      description: '''Prepare for publishing?
        Changes version based on release notes,
        copies release notes to changelog,
        creates a draft GitHub release and
        pushes a tagged commit to git.
      ''',
    )
    booleanParam(
      name: 'PACKAGE',
      defaultValue: false,
      description: '''Produce a package?
        PRs don't get packaged by default,
        but you can rebuild with this to produce distribution packages for all supported platforms.
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
        // Setting the TAG_NAME env as this is not happening when skipping default checkout.
        script {
          // Read any tags pointing at the current commit
          env.TAG_NAME = sh(
            script: 'git tag --points-at HEAD',
            returnStdout: true,
          ).trim()
          // Read any tags pointing at the previous commit
          env.PREVIOUS_TAG_NAME = sh(
            script: 'git tag --points-at HEAD~1',
            returnStdout: true,
          ).trim()
          // Was the previous commit tagged to prepare for a release?
          env.WAS_PREPARED = PREVIOUS_TAG_NAME ==~ /prepared-.+/
        }
      }
    }
    
    stage('Install & update version') {
      steps {
        // Install dependencies
        sh 'npm install'
        // Update the version
        script {
          if (TAG_NAME && TAG_NAME.startsWith("v")) {
            // Update the build display name
            currentBuild.displayName += ": ${TAG_NAME} (publish)"
          } else if (PREPARE == "true") {
            // Read the current version of the package
            packageJson = readJSON file: 'package.json'
            versionBefore = "v${packageJson.version}"
            // Change the version
            nextVersion = changeVersion()
            // Add to the displa name of the build job that we're preparing a release
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

    // Simple packaging for PRs and runs that don't prepare for releases
    stage('Package') {
      when {
        anyOf {
          // Package if asked specifically by the parameter
          environment name: 'PACKAGE', value: 'true'
          // Or if the previous commit was tagged
          expression { return PREVIOUS_TAG_NAME =~ /^prepared-/ }
        }
      }
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
      when {
        // Don't do this when preparing for a release
        not { environment name: 'PREPARE', value: 'true' }
      }
      steps {
        println "Missing some post package tests ..."
      }
    }

    // More advanced packaging for commits tagged as versions
    // 1. Tag the commit and push that to GitHub,
    // 2. Creating a draft GitHub release
    stage('Publish') {
      when {
        // We should publish only if we're at a commit with a parent commit that prepared a release
        // This will be the case for the commit resulting from merging in the PR prepared by CI
        expression { return WAS_PREPARED }
      }
      steps {
        /*
        withCredentials([
          string(credentialsId: 'github-release-token', variable: 'GITHUB_TOKEN')
        ]) {
          // Create a draft release on GitHub
          script {
            withCredentials([
              string(credentialsId: 'github-release-token', variable: 'GITHUB_TOKEN')
            ]) {
              sh "node scripts/github-releases create-draft $nextVersion RELEASENOTES.md"
            }
          }
          // Upload artifacts to GitHub
          script {
            for (file in findFiles(glob: 'dist/*')) {
              sh "node scripts/github-releases upload-asset $TAG_NAME $file"
            }
          }
          // Publish the release
          script {
            sh "node scripts/github-releases publish $TAG_NAME"
          }
        }
        // TODO: Annouce this on Slack
        */
        println "Publish!"
      }
    }

    // Prepares for a release by
    // 1. Copying release notes to the changelog,
    // 2. Pushing a branch with a tagged commit to GitHub
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
          copyReleaseNotes(versionBefore, nextVersion)
        }

        // Set the email and name used when committing
        sh 'git config --global user.email "ci@realm.io"'
        sh 'git config --global user.name "Jenkins CI"'
        
        // Checkout a branch
        sh "git checkbout -b ${PREPARED_BRANCH}"

        // Stage the updates to the files, commit and tag the commit
        sh 'git add package.json package-lock.json CHANGELOG.md RELEASENOTES.md'
        sh "git commit -m 'Prepare version ${nextVersion}'"
        sh "git tag -f prepared-${nextVersion}"

        // Push to GitHub with tags
        sshagent(['realm-ci-ssh']) {
          sh "git push --set-upstream --tags origin ${PREPARED_BRANCH}"
        }
        
        // TODO: Create a PR
      }
    }
  }
}
