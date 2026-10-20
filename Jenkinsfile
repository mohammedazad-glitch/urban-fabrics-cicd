pipeline {
  agent any

  environment {
    // Set this in the Jenkins job or replace with your Docker Hub namespace.
    DOCKERHUB_NAMESPACE = 'YOUR_DOCKERHUB_USERNAME'
    IMAGE_NAME = 'urban-fabrics'
    K8S_NAMESPACE = 'default'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        script { env.IMAGE_TAG = sh(script: 'git rev-parse --short=7 HEAD', returnStdout: true).trim() }
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
        sh 'docker build --pull -t "$DOCKERHUB_NAMESPACE/$IMAGE_NAME:$IMAGE_TAG" .'
      }
    }

    stage('Push image') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_TOKEN')]) {
          sh '''
            set +x
            printf '%s' "$DOCKERHUB_TOKEN" | docker login --username "$DOCKERHUB_USER" --password-stdin
            docker push "$DOCKERHUB_NAMESPACE/$IMAGE_NAME:$IMAGE_TAG"
            docker logout
          '''
        }
      }
    }

    stage('Deploy to Minikube') {
      steps {
        // Jenkins agent must have kubectl context access to the target Minikube.
        sh '''
          export IMAGE_TAG="$IMAGE_TAG"
          export DOCKERHUB_NAMESPACE="$DOCKERHUB_NAMESPACE"
          envsubst < k8s/deployment.yaml | kubectl apply -f -
          kubectl apply -f k8s/service.yaml
          kubectl -n "$K8S_NAMESPACE" rollout status deployment/urban-fabrics --timeout=180s
          kubectl -n "$K8S_NAMESPACE" get deployment,pods,service -l app=urban-fabrics
        '''
      }
    }
  }

  post {
    always {
      sh 'docker image rm "$DOCKERHUB_NAMESPACE/$IMAGE_NAME:$IMAGE_TAG" || true'
    }
  }
}
