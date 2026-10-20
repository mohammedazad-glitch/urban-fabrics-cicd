# Urban Fabrics

A lightweight, frontend-only fabric storefront built with React and Vite. Production uses a multi-stage Node build and a small Nginx Alpine image; the browser downloads static files and does not need Node running on the server. Product imagery stays on Unsplash, requested as responsive-size crops with lazy loading below the fold, so image delivery needs internet access.

## Local development and production build

Requirements: Node.js 20+ and npm.

```sh
npm ci
npm run dev
npm run build
```

Vite prints the actual output file sizes after a successful production build. To total the generated files in bytes:

```sh
du -ah dist | sort -h
```

## Docker

The Docker build excludes Git metadata, dependencies, local output, environment files, and credential/key files through `.dockerignore`. The Dockerfile copies only package manifests and app source into the build stage; it never copies `.env` or credentials. Configure registry credentials in Jenkins Credentials, not in the repository.

```sh
docker build -t urban-fabrics:local .
docker run --rm -p 8080:8080 urban-fabrics:local
```

Open <http://localhost:8080>. The Nginx process listens on 8080 as an unprivileged user.

## Kubernetes / Minikube demo

The manifests use one replica and small requests (25m CPU, 32 MiB RAM) and limits (250m CPU, 96 MiB RAM). Change the image placeholder through environment substitution:

```sh
export DOCKERHUB_NAMESPACE=your-dockerhub-username
export IMAGE_TAG=your-commit-tag
envsubst < k8s/deployment.yaml | kubectl apply -f -
kubectl apply -f k8s/service.yaml
kubectl rollout status deployment/urban-fabrics
kubectl get deployment,pods,service -l app=urban-fabrics
minikube service urban-fabrics --url
```

The Docker Hub image must be public for unauthenticated Minikube pulls. For a private repository, create a Kubernetes image pull secret from a read-only registry token using an interactive/secret-safe mechanism, then set `imagePullSecrets` on the pod; do not commit the token.

## Jenkins setup

`Jenkinsfile` checks out the configured SCM, runs `npm ci` and `npm run build`, builds the image, pushes a short Git commit SHA tag, applies the manifests, waits for rollout, and reports the deployment, pods, and Service. Configure `DOCKERHUB_NAMESPACE` in the Jenkins job and create a Jenkins username/password credential with ID `dockerhub-creds`; use a Docker Hub access token as its password. Required tools on the Jenkins agent: Node/npm, Docker CLI/daemon access, `kubectl`, and `envsubst`. Required Jenkins plugins: Pipeline and Credentials Binding.

The Jenkins agent must have network access to the Kubernetes API and a valid kubeconfig for the Minikube cluster. Jenkins on EC2 and Minikube in a separate local VM do not share cluster access automatically. Do not expose the Kubernetes API or copy a broadly privileged kubeconfig onto an untrusted agent. A safer student setup is to run Jenkins and Minikube in one controlled lab environment, or use a trusted deployment agent with narrowly scoped cluster credentials.

## EC2 sizing gate

Before installing Jenkins, Docker, and Minikube together, inspect the actual host:

```sh
uname -m
nproc
free -h
df -h /
cat /etc/os-release
```

Also inspect current Docker, Java, Jenkins, kubectl, and Minikube versions/status before proposing installation commands. Do not install the whole stack until CPU, RAM, disk, and architecture are confirmed. A roughly 1 GiB RAM host is likely too constrained for Jenkins plus Docker plus Minikube to operate reliably. Stop and assess before upgrading or creating AWS resources. Lowest-cost compliant option when it is undersized: use a local machine or existing CI worker for the Jenkins+Minikube demonstration without creating/upgrading EC2; if the rubric requires Jenkins on AWS, first compare the smallest suitable instance cost with the account's current eligibility and obtain approval before resizing. AWS Free Tier eligibility varies by account age, region, instance type, usage, and current terms.

## Second-deployment evidence

1. Run the Jenkins pipeline once and record the commit SHA tag plus successful rollout.
2. Make a visible source change, commit and push it.
3. Run the pipeline again. The new commit produces a different image tag and the Deployment rolls out that exact tag.
4. Capture Jenkins stage results, the new Deployment image/rollout, running pod, Service, and application page for the report.

## Assignment submission checklist

- Repository URL, `Jenkinsfile`, `Dockerfile`, and `k8s/` manifests.
- Screenshot of first successful deployment and second deployment after a visible source change.
- Jenkins pipeline stages and Kubernetes rollout/pod/Service evidence.
- Application screenshot and a short note on the lightweight build and runtime.

## Limitations

This is a frontend demo. Cart state is in browser memory, checkout does not take payment, and there is no account, inventory, order, or backend service. Newsletter submission is only a UI confirmation.
