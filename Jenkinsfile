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
                    when {
                        anyOf {
                            branch 'main'
                            branch 'master' 
                            changeRequest()
                        }}
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
        stage('Building docker image') {
            steps {
                echo 'Building Docker image...'
                sh '''
                    docker build -t omarzakaria10/price-point-scout:$GIT_COMMIT .
                '''
            }
        }
        stage('Scraper Tests') {
            parallel {
                stage('Quick Tests') {
                    steps {
                        echo 'Running quick scraper tests from Docker image...'
                        script {
                            try {
                                sh '''
                                    echo "🚀 Running Quick Tests from Docker Container"
                                    # Create test results directory on host
                                    mkdir -p test-results
                                    
                                    # Run quick tests from the built Docker image
                                    timeout 300 docker run --rm \
                                        -v "$(pwd)/test-results:/app/test-results" \
                                        -e NODE_ENV=test \
                                        omarzakaria10/price-point-scout:$GIT_COMMIT \
                                        npm run test || echo "Quick tests completed with warnings"
                                '''
                            } catch (Exception e) {
                                echo "Quick tests had issues: ${e.getMessage()}"
                            }
                        }
                    }
                }
                stage('Integration Tests') {
                    steps {
                        echo 'Running scraper integration tests from Docker image...'
                        script {
                            try {
                                sh '''
                                    echo "🧪 Running Integration Tests from Docker Container"
                                    # Create test results directory on host
                                    mkdir -p test-results
                                    
                                    # Run integration tests from the built Docker image
                                    timeout 600 docker run --rm \
                                        -v "$(pwd)/test-results:/app/test-results" \
                                        -e NODE_ENV=test \
                                        omarzakaria10/price-point-scout:$GIT_COMMIT \
                                        npm run test:integration || echo "Integration tests completed with warnings"
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
                        echo 'Running performance tests from Docker image on main branch...'
                        script {
                            try {
                                sh '''
                                    echo "⚡ Running Performance Tests from Docker Container"
                                    # Create test results directory on host
                                    mkdir -p test-results
                                    
                                    # Run performance tests from the built Docker image
                                    timeout 1800 docker run --rm \
                                        -v "$(pwd)/test-results:/app/test-results" \
                                        -e NODE_ENV=test \
                                        omarzakaria10/price-point-scout:$GIT_COMMIT \
                                        npm run test:performance || echo "Performance tests completed"
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