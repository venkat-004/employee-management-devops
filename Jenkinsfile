pipeline {

    agent any

    tools {
        jdk 'JDK21'
    }

    environment {
        DOCKER_IMAGE = 'venkat0707/employee-app:latest'
        SONAR_PROJECT_KEY = 'Employee-mgmt'
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

        stage('SonarQube Analysis') {
            steps {
                withCredentials([
                    string(
                        credentialsId: 'sonar-token',
                        variable: 'SONAR_TOKEN'
                    )
                ]) {
                    bat '''
                        mvn clean verify org.sonarsource.scanner.maven:sonar-maven-plugin:5.7.0.6970:sonar ^
                        -Dsonar.projectKey=%SONAR_PROJECT_KEY% ^
                        -Dsonar.host.url=%SONAR_HOST_URL% ^
                        -Dsonar.token=%SONAR_TOKEN%
                    '''
                }
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
            echo 'Pipeline completed successfully!'
        }

        failure {
            echo 'Pipeline failed. Check the console log.'
        }

        always {
            echo 'Pipeline finished.'
        }
    }
}