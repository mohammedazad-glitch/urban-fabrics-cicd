
pipeline {
    agent any

    environment {
        PATH+KUBECTL = '/snap/bin:/usr/local/bin'
        DOCKERHUB_NAMESPACE = 'mohammed071'
        IMAGE_NAME = 'urban-fabrics'
        K8S_NAMESPACE = 'default'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm

                script {
                    env.IMAGE_TAG = sh(
                        script: 'git rev-parse --short=7 HEAD',
                        returnStdout: true
                    ).trim()
                }
            }
        }

        stage('Build application') {
            steps {
                sh 'npm ci'
                sh 'npm run build'
            }
        }

        stage('Build image') {
            steps {
                sh '''
                    docker build --pull \
                      -t "$DOCKERHUB_NAMESPACE/$IMAGE_NAME:$IMAGE_TAG" .
                '''
            }
        }

        stage('Push image') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKERHUB_USER',
                        passwordVariable: 'DOCKERHUB_TOKEN'
                    )
                ]) {
                    sh '''
                        set +x

                        printf '%s' "$DOCKERHUB_TOKEN" |
                          docker login \
                            --username "$DOCKERHUB_USER" \
                            --password-stdin

                        docker push \
                          "$DOCKERHUB_NAMESPACE/$IMAGE_NAME:$IMAGE_TAG"

                        docker logout
                    '''
                }
            }
        }

        stage('Deploy to Minikube') {
            steps {
                sh '''
                    set -e

                    echo "Checking Kubernetes access..."
                    kubectl get nodes

                    echo "Applying Kubernetes deployment..."
                    envsubst < k8s/deployment.yaml |
                      kubectl apply -n "$K8S_NAMESPACE" -f -

                    echo "Applying Kubernetes service..."
                    kubectl apply \
                      -n "$K8S_NAMESPACE" \
                      -f k8s/service.yaml

                    echo "Waiting for deployment..."
                    kubectl -n "$K8S_NAMESPACE" rollout status \
                      deployment/urban-fabrics \
                      --timeout=180s

                    echo "Checking deployment resources..."
                    kubectl -n "$K8S_NAMESPACE" get \
                      deployment,pods,service \
                      -l app=urban-fabrics
                '''
            }
        }
    }

    post {
        always {
            sh '''
                if [ -n "$IMAGE_TAG" ]; then
                    docker image rm \
                      "$DOCKERHUB_NAMESPACE/$IMAGE_NAME:$IMAGE_TAG" \
                      || true
                fi
            '''
        }
    }
}
```
