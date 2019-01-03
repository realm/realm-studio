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

pipeline {
  agent {
    dockerfile {
      filename 'Dockerfile.testing'
      label 'docker'
      // /etc/passwd is mapped so a jenkins users is available from within the container
      // ~/.ssh is mapped to allow pushing to GitHub via SSH
      args '-e "HOME=${WORKSPACE}" -v /etc/passwd:/etc/passwd:ro -v /home/jenkins/.ssh:/home/jenkins/.ssh:ro'
    }
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
      description: '''Prepare for publishing?
        Changes version based on release notes,
        copies release notes to changelog,
        creates a draft GitHub release and
        pushes a tagged commit to git.
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
          env.TAG_NAME = sh(
            script: 'git tag --points-at HEAD',
            returnStdout: true,
          ).trim()
          env.PREVIOUS_TAG_NAME = sh(
            script: 'git tag --points-at HEAD~1',
            returnStdout: true,
          ).trim()
        }
      }
    }

    stage('Install') {
      steps {
        // Perform the install
        sh 'npm install'
      }
    }
    
    stage('Update version') {
      steps {
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
      }
    }

    stage('Pre-package tests') {
      when {
        // Don't do this when preparing for a release
        not { environment name: 'PREPARE', value: 'true' }
      }
      parallel {
        stage('Unit tests') {
          steps {
            sh 'MOCHA_FILE=pre-test-results.xml npm run test:ci'
          }
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
        }
      }
    }

    // Simple packaging for PRs and runs that don't prepare for releases
    stage('Package') {
      when {
        // Don't do this when preparing for a release
        not { environment name: 'PREPARE', value: 'true' }
        // Don't package PRs
        // not { changeRequest() }
      }
      agent {
        node {
          label 'macos-cph-02.cph.realm'
        }
      }
      steps {
        // Package and archive the archive
        script {
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
        // Don't do this when preparing for a release
        not { environment name: 'PREPARE', value: 'true' }
        // Check if a tag starting with a v (for version) is pointing at this commit
        // expression {}
      }
      steps {
        /*
        // Upload artifacts to GitHub and publish release
        withCredentials([
          string(credentialsId: 'github-release-token', variable: 'GITHUB_TOKEN')
        ]) {
          script {
            for (file in findFiles(glob: 'react-realm-context-*.tgz')) {
              sh "node scripts/github-releases upload-asset $TAG_NAME $file"
            }
          }
          script {
            sh "node scripts/github-releases publish $TAG_NAME"
          }
        }
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
      steps {
        // Append the RELEASENOTES to the CHANGELOG
        script {
          copyReleaseNotes(versionBefore, nextVersion)
        }
        // Create a draft release on GitHub
        script {
          withCredentials([
            string(credentialsId: 'github-release-token', variable: 'GITHUB_TOKEN')
          ]) {
            sh "node scripts/github-releases create-draft $nextVersion RELEASENOTES.md"
          }
        }

        // Set the email and name used when committing
        sh 'git config --global user.email "ci@realm.io"'
        sh 'git config --global user.name "Jenkins CI"'

        // Stage the updates to the files, commit and tag the commit
        sh 'git add package.json package-lock.json CHANGELOG.md RELEASENOTES.md'
        sh "git commit -m 'Prepare version ${nextVersion}'"
        sh "git tag -f ${nextVersion}"

        // Push to GitHub with tags
        sshagent(['realm-ci-ssh']) {
          sh "git push --tags origin HEAD"
        }
      }
    }
  }
}
