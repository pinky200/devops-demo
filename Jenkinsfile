pipeline {
    agent any
    environment {
        ACR_NAME = 'myjenkinsacr.azurecr.io'
        IMAGE_NAME = 'demo-app'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }
    stages {
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ${ACR_NAME}/${IMAGE_NAME}:${IMAGE_TAG} ./app'
            }
        }
        stage('Push to ACR') {
            steps {
                sh 'az acr login --name myjenkinsacr'
                sh 'docker push ${ACR_NAME}/${IMAGE_NAME}:${IMAGE_TAG}'
            }
        }
        stage('Update K8s Manifest') {
            steps {
                sh """
                    sed -i 's|image:.*|image: ${ACR_NAME}/${IMAGE_NAME}:${IMAGE_TAG}|' k8s/deployment.yaml
                """
            }
        }
    }
}
