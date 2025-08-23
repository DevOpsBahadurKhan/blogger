pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'blogbuddy_app'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/DevOpsBahadurKhan/blogger.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${DOCKER_IMAGE} ."
            }
        }

        stage('Start Services') {
            steps {
                sh "docker-compose up -d --build"
            }
        }

        stage('Migrate & Seed DB') {
            steps {
                sh "docker exec blogbuddy_app npm run deploy"
            }
        }

        stage('Clean Up') {
            steps {
                sh "docker system prune -f"
            }
        }
    }

    post {
        always {
            echo "Deployment finished!"
        }
    }
}
