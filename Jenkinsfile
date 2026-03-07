pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        skipDefaultCheckout(true)
    }

    environment {
        REGISTRY    = '10.0.10.228'
        PROJECT     = 'yahshua'
        IMAGE       = 'hris-fe'
        IMAGE_REPO  = "${REGISTRY}/${PROJECT}/${IMAGE}"
        REMOTE_HOST = '10.10.10.243'
    }

    parameters {
        booleanParam(name: 'BUILD', defaultValue: true, description: 'Build and push Docker image')
        booleanParam(name: 'DEPLOY', defaultValue: false, description: 'Deploy IMAGE_TAG to Kubernetes')
        string(name: 'IMAGE_TAG', defaultValue: '', description: 'Image tag to push/deploy (required)')
    }

    stages {
        stage('Validate Inputs') {
            steps {
                script {
                    if (!params.IMAGE_TAG?.trim()) {
                        error('IMAGE_TAG is required.')
                    }

                    // Docker tags cannot contain "/" and other special chars.
                    env.SAFE_IMAGE_TAG = params.IMAGE_TAG
                        .trim()
                        .replaceAll('[^A-Za-z0-9_.-]', '-')

                    if (!env.SAFE_IMAGE_TAG?.trim()) {
                        error('IMAGE_TAG is invalid after sanitization.')
                    }

                    if (env.SAFE_IMAGE_TAG != params.IMAGE_TAG) {
                        echo "Using sanitized IMAGE_TAG: ${env.SAFE_IMAGE_TAG}"
                    }
                }
            }
        }

        stage('Clean Workspace') {
            when {
                expression { return params.BUILD }
            }
            steps {
                deleteDir()
            }
        }

        stage('Checkout') {
            when {
                expression { return params.BUILD }
            }
            steps {
                checkout scm
            }
        }

        stage('Build & Push (Harbor)') {
            when {
                expression { return params.BUILD }
            }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'harborCreds',
                    usernameVariable: 'HARBOR_USERNAME',
                    passwordVariable: 'HARBOR_PASSWORD'
                )]) {
                    sh '''
                        set -e

                        echo "$HARBOR_PASSWORD" | docker login "$REGISTRY" \
                          -u "$HARBOR_USERNAME" --password-stdin

                        docker build \
                          -f Dockerfile.prod \
                          -t ${IMAGE_REPO}:${SAFE_IMAGE_TAG} \
                          .

                        docker push ${IMAGE_REPO}:${SAFE_IMAGE_TAG}

                        docker logout "$REGISTRY"

                        echo "Pushed ${IMAGE_REPO}:${SAFE_IMAGE_TAG}"
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes (SSH)') {
            when {
                expression { return params.DEPLOY }
            }
            steps {
                withCredentials([
                    string(credentialsId: 'INFISICAL_TOKEN_HRIS_FE', variable: 'INFISICAL_TOKEN'),
                    usernamePassword(
                        credentialsId: 'payroll-sterling-prod-deploy-userpass',
                        usernameVariable: 'REMOTE_USER',
                        passwordVariable: 'REMOTE_PASS'
                    )
                ]) {
                    sh '''
set -euo pipefail

sshpass -p "${REMOTE_PASS}" ssh -o StrictHostKeyChecking=no "${REMOTE_USER}@${REMOTE_HOST}" \
  "IMAGE_TAG='${SAFE_IMAGE_TAG}' INFISICAL_TOKEN='${INFISICAL_TOKEN}' bash -se" <<'REMOTE_EOF'
set -euo pipefail

# Optional: export FE env from Infisical and create ConfigMap (remove block if FE has no Infisical path)
infisical export \
  --domain="https://usdc-vault.cytechint.io" \
  --token="${INFISICAL_TOKEN}" \
  --env="production" \
  --path="/hris-fe" \
  --format=dotenv > /tmp/hris-fe.env 2>/dev/null || true

if [ -s /tmp/hris-fe.env ]; then
  sed -i -E "s/^([A-Za-z_][A-Za-z0-9_]*=)'(.*)'$/\\1\\2/" /tmp/hris-fe.env
  kubectl -n hris create configmap hris-fe-env \
    --from-env-file=/tmp/hris-fe.env \
    --dry-run=client -o yaml | kubectl apply -f -
fi

# apply FE manifests
kubectl apply -f /home/crnd/workspace/yahshua-kubernetes/envs/prod/hris-fe/deployment.yaml

# set image to the tag we just built
kubectl -n hris set image deployment/hris-fe \
  hris-fe=10.0.10.228/yahshua/hris-fe:${IMAGE_TAG}

kubectl -n hris rollout restart deployment/hris-fe
kubectl -n hris rollout status deployment/hris-fe --timeout=300s

kubectl -n hris get pods

rm -f /tmp/hris-fe.env
REMOTE_EOF
'''
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully'
        }
        failure {
            echo 'Pipeline failed'
        }
    }
}
