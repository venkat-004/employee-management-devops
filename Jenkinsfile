pipeline {

    agent any

    tools {
        jdk 'JDK21'
        
    }

    environment {
        DOCKER_IMAGE = 'venkat0707/employee-app:latest'
        SONAR_PROJECT_KEY = 'employee-mgmt'
        SONAR_HOST_URL = 'http://localhost:9000'
    }

    stages {

        stage('Checkout from Git') {
            steps {
                checkout scm
            }
        }

        stage('Build with Maven') {
            steps {
                bat 'mvn clean compile'
            }
        }

        stage('Test') {
            steps {
                bat 'mvn test'
            }
        }

        stage('Code Coverage & SonarQube Analysis') {
            steps {
                bat 'mvn verify sonar:sonar -Dsonar.projectKey=%SONAR_PROJECT_KEY% -Dsonar.host.url=%SONAR_HOST_URL%'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t %DOCKER_IMAGE% .'
            }
        }

        stage('Push Docker Image') {
            steps {
                bat 'docker push %DOCKER_IMAGE%'
            }
        }
    }

    post {
        success {
            echo 'Employee Pipeline completed successfully!'
        }

        failure {
            echo 'Employee Pipeline failed. Check the console output.'
        }
    }
}