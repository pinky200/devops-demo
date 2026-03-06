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
                withCredentials([usernamePassword(credentialsId: 'acr-credentials', usernameVariable: 'ACR_USER', passwordVariable: 'ACR_PASS')]) {
                    sh 'docker login ${ACR_NAME} -u ${ACR_USER} -p ${ACR_PASS}'
                    sh 'docker push ${ACR_NAME}/${IMAGE_NAME}:${IMAGE_TAG}'
                }
            }
        }
        stage('Update K8s Manifest') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'github-credentials', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN')]) {
                    sh """
                        sed -i 's|image:.*|image: ${ACR_NAME}/${IMAGE_NAME}:${IMAGE_TAG}|' k8s/deployment.yaml
                        git config user.email "jenkins@demo.com"
                        git config user.name "Jenkins"
                        git add k8s/deployment.yaml
                        git commit -m "Update image to ${IMAGE_TAG}"
                        git push https://\${GIT_USER}:\${GIT_TOKEN}@github.com/pinky200/devops-demo.git main
                    """
                }
            }
        }
    }
}
