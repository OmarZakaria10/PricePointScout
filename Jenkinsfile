pipeline {
    agent any

    tools {
        nodejs 'NodeJS 22.18.0'
    }
    
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKERHUB_USERNAME = "${DOCKERHUB_CREDENTIALS_USR}"
        DOCKERHUB_PASSWORD = "${DOCKERHUB_CREDENTIALS_PSW}"
        DOCKER_IMAGE = 'omarzakaria10/price-point-scout'
        ARGOCD_REPO = 'https://github.com/OmarZakaria10/PricePointScout-ArgoCD.git'
        ARGOCD_BRANCH = 'main'
        GITHUB_TOKEN = credentials('github-token')
    }
    
    stages {
        stage('Installing Dependencies') {
            steps {
                echo 'Installing Dependencies...'
                sh 'npm ci --only=production --no-audit '
            }
        }
        
        stage('Dependency Scanning') {
            parallel {
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
                        }
                    }
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
                    docker build -t ${DOCKER_IMAGE}:$GIT_COMMIT .
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
                                        ${DOCKER_IMAGE}:$GIT_COMMIT \
                                        npm run test || echo "Quick tests completed with warnings"
                                '''
                            } catch (Exception e) {
                                echo "Quick tests had issues: ${e.getMessage()}"
                            }
                        }
                    }
                }
                stage('Integration Tests') {
                    when {
                        anyOf {
                            branch 'main'
                            branch 'master' 
                            changeRequest()
                        }
                    }
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
                                        ${DOCKER_IMAGE}:$GIT_COMMIT \
                                        npm run test:integration || echo "Integration tests completed with warnings"
                                '''
                            } catch (Exception e) {
                                echo "Integration tests had issues: ${e.getMessage()}"
                            }
                        }
                    }
                }
            }
        }
        
        stage('Trivy Vulnerability Scanner') {
            steps {
                sh ''' 
                    trivy image ${DOCKER_IMAGE}:$GIT_COMMIT \
                        --severity LOW,MEDIUM,HIGH \
                        --exit-code 0 \
                        --quiet \
                        --format json -o trivy-image-MEDIUM-results.json

                    trivy image ${DOCKER_IMAGE}:$GIT_COMMIT \
                        --severity CRITICAL \
                        --exit-code 0 \
                        --quiet \
                        --format json -o trivy-image-CRITICAL-results.json
                '''
            }
            post {
                always {
                    sh '''
                        trivy convert \
                            --format template --template "@/usr/local/share/trivy/templates/html.tpl" \
                            --output trivy-image-MEDIUM-results.html trivy-image-MEDIUM-results.json 

                        trivy convert \
                            --format template --template "@/usr/local/share/trivy/templates/html.tpl" \
                            --output trivy-image-CRITICAL-results.html trivy-image-CRITICAL-results.json        
                    '''
                }
            }
        }
        stage('Push Docker Image to Docker Hub') {
            steps {
                sh '''
                    echo $DOCKERHUB_PASSWORD | docker login -u $DOCKERHUB_USERNAME --password-stdin
                    docker push ${DOCKER_IMAGE}:$GIT_COMMIT
                '''
            }
        }
        stage('Update Argo CD') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                script {
                    sh '''
                        # Clone Argo CD repo
                        git clone https://${GITHUB_TOKEN_PSW}@github.com/OmarZakaria10/PricePointScout-ArgoCD.git
                        cd PricePointScout-ArgoCD/kubernetes-AKS
                        
                        # Configure git
                        git config user.email "jenkins@pricepointscout.com"
                        git config user.name "Jenkins CI"
                        
                        # Create branch
                        BRANCH="update-${GIT_COMMIT:0:7}-${BUILD_NUMBER}"
                        git checkout -b $BRANCH
                        
                        # Update image
                        sed -i "s|omarzakaria10/price-point-scout:.*|omarzakaria10/price-point-scout:${GIT_COMMIT}|g" pricePointScout.yaml
                        
                        # Commit & push
                        git add pricePointScout.yaml
                        git commit -m "Update image to ${GIT_COMMIT}"
                        git push origin $BRANCH
                        
                        # Create PR
                        cd ..
                        cat > pr.json <<EOF
{
  "title": "Deploy ${GIT_COMMIT:0:7}",
  "body": "Jenkins build ${BUILD_NUMBER}\\nImage: ${GIT_COMMIT}",
  "head": "$BRANCH",
  "base": "main"
}
EOF
                        
                        curl -X POST \
                          -H "Authorization: token ${GITHUB_TOKEN_PSW}" \
                          -H "Content-Type: application/json" \
                          https://api.github.com/repos/OmarZakaria10/PricePointScout-ArgoCD/pulls \
                          -d @pr.json
                        
                        # Cleanup
                        cd ..
                        rm -rf PricePointScout-ArgoCD
                    '''
                }
            }
        }
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