#!groovy

pipeline {
  agent {
    docker {
      image 'node:8'
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

    stage('Lint & build') {
      when {
        // Don't do this when preparing for a release
        not { environment name: 'PREPARE', value: 'true' }
      }
      parallel {
        stage('Lint') {
          steps {
            sh 'npm run lint:ts'
          }
        }

        stage('Build') {
          steps {
            sh 'npm run build'
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
            // sh 'MOCHA_FILE=pre-unit-test-results.xml npm run test:ci -- src/**/*.test.tsx'
            println "Test!"
          }
        }
      }
      post {
        always {
          junit(
            allowEmptyResults: true,
            keepLongStdio: true,
            testResults: 'pre-*-test-results.xml'
          )
        }
      }
    }

    // Simple packaging for PRs and runs that don't prepare for releases
    stage('Package') {
      when {
        // Don't do this when preparing for a release
        not { environment name: 'PREPARE', value: 'true' }
      }
      steps {
        script {
          if (TAG_NAME && TAG_NAME.startsWith("v")) {
            // Update the build display name
            currentBuild.displayName += ": ${TAG_NAME} (publish)"
          } else {
            // Change the version to a prerelease if it's not preparing or is a release
            changeVersion "${JOB_BASE_NAME}-${BUILD_NUMBER}"
          }
        }
        // Package and archive the archive
        script {
          // packAndArchive()
          println "Package!"
        }
      }
    }

    stage('Post-packaging tests') {
      when {
        // Don't do this when preparing for a release
        not { environment name: 'PREPARE', value: 'true' }
      }
      steps {
        println "Post-package tests!"
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
    // 1. Changing version,
    // 2. Copying release notes to the changelog,
    // 3. Pushing a branch with a tagged commit to GitHub
    stage('Prepare') {
      when {
        environment name: 'PREPARE', value: 'true'
      }
      steps {
        script {
          // Read the current version of the package
          packageJson = readJSON file: 'package.json'
          versionBefore = "v${packageJson.version}"
          // Change the version
          nextVersion = changeVersion()
          // Add to the displa name of the build job that we're preparing a release
          currentBuild.displayName += " (prepare)"
        }
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
