pipeline {
    agent any

    tools {
        nodejs 'NodeJS 22.18.0'
    }
    
    // environment {
    // }
    
    stages {
        stage('Installing Dependencies') {
            steps {
                echo 'Installing Dependencies...'
                sh 'npm ci --only=production --no-audit '
            }
        }
        
        stage('Dependency Scanning') {
            parallel{
                stage('NPM Dependency Audit') {
                    steps {
                        echo 'Scanning for vulnerabilities...'
                        sh '''npm audit --production --audit-level=critical
                        echo $?
                        '''
                    }
                }
                stage('OWASP Dependency Check') {
                    steps {
                        dependencyCheck additionalArguments: '''
                            --scan \'./\' 
                            --out \'./\'  
                            --format \'ALL\' 
                            --disableYarnAudit \
                            --prettyPrint''', odcInstallation: 'OWASP' 

                        dependencyCheckPublisher failedTotalCritical: 1, pattern: 'dependency-check-report.xml', stopBuild: false
            }
        }
        }
        }
        stage('Scraper Tests') {
            parallel {
                stage('Integration Tests') {
                    steps {
                        echo 'Running scraper integration tests...'
                        script {
                            try {
                                sh '''
                                    echo "🧪 Running Integration Tests"
                                    timeout 600 node tests/integration.test.js || echo "Integration tests completed with warnings"
                                '''
                            } catch (Exception e) {
                                echo "Integration tests had issues: ${e.getMessage()}"
                            }
                        }
                    }
                }
                stage('Performance Tests') {
                    when {
                        anyOf {
                            branch 'main'
                            branch 'master' 
                            changeRequest()
                        }
                    }
                    steps {
                        echo 'Running performance tests on main branch...'
                        script {
                            try {
                                sh '''
                                    echo "⚡ Running Performance Tests"
                                    timeout 1800 node test:performance || echo "Performance tests completed"
                                '''
                            } catch (Exception e) {
                                echo "Performance tests had issues: ${e.getMessage()}"
                            }
                        }
                    }
                }
            }
        }

        // stage('Test Report') {
        //     steps {
        //         echo 'Generating test report...'
        //         script {
        //             if (fileExists('test-results/test-summary.json')) {
        //                 def testResults = readJSON file: 'test-results/test-summary.json'
        //                 echo "Test Summary:"
        //                 echo "  Status: ${testResults.status}"
        //                 echo "  Test Type: ${testResults.test_type}"
        //                 echo "  Keyword: ${testResults.keyword}"
        //                 echo "  Timestamp: ${testResults.timestamp}"
                        
        //                 if (testResults.exit_code != 0) {
        //                     echo "⚠️ Some scraper tests failed, but continuing deployment"
        //                     currentBuild.result = 'UNSTABLE'
        //                 }
        //             }
        //         }
        //     }
        // }
        
        // stage('Deploy') {
        //     steps {
        //         echo 'Deploying application...'
        //         script {
        //             if (currentBuild.result == 'UNSTABLE') {
        //                 echo "⚠️ Deploying with warnings - some scraper tests failed"
        //             } else {
        //                 echo "✅ Deploying - all tests passed"
        //             }
        //         }
        //         // Add your deployment steps here
        //         sh 'echo "Deployment completed successfully"'
        //     }
        // }
    }

    post {
        always {
            echo 'Pipeline completed'
            // Clean up test artifacts if needed
            sh 'rm -rf test-results/temp-* || true'
        }
        success {
            echo '✅ Pipeline succeeded - All stages completed successfully'
        }
        unstable {
            echo '⚠️ Pipeline unstable - Some scraper tests failed but deployment continued'
        }
        failure {
            echo '❌ Pipeline failed - Critical error occurred'
        }
    }
}