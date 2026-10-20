# Codex task: Finish URBAN FABRICS from a clean start

You are working in the fresh `urban_fabrics_fresh_website` project. The goal is to preserve the existing Urban Fabrics storefront design, make sure it builds cleanly, then prepare it for the CCA 2 CI/CD assignment. Work in small, verifiable steps and explain commands briefly.

## Context and assignment requirements
The student guide requires:
1. Existing academic project stored in GitHub.
2. Jenkins running on AWS and using a `Jenkinsfile`.
3. Application build/test stage (if there are no tests, use build/lint/syntax check and explain it).
4. A working `Dockerfile`.
5. Build and push an image to Docker Hub or AWS ECR using credentials stored securely in Jenkins.
6. Kubernetes `Deployment` and `Service` YAML manifests in `k8s/`.
7. Deploy on Minikube and verify pods, deployment, service, and application access.
8. Make a visible source-code change, push it, run the pipeline again, and prove the new version was deployed.
9. Submit repository URL, `Jenkinsfile`, `Dockerfile`, Kubernetes manifests, screenshots, and a short README/report.

## Rules
- Start by inspecting the current folder and files. Do not assume the old project or old server configuration is correct.
- Keep this project frontend-only for now. Do not add a database, authentication, real checkout, payment processing, or pretend these features work.
- Preserve the current Urban Fabrics visual design and working frontend interactions.
- Fix compile, lint, accessibility, and runtime issues you actually find. Do not make unrelated redesigns.
- Never hard-code secrets, Docker Hub passwords, cloud credentials, tokens, or private keys. Use Jenkins Credentials for secrets.
- Do not delete, overwrite, or modify the old GitHub repository or existing Vercel deployment without explicit approval.
- Do not create AWS resources, incur costs, change security groups, or run destructive commands without asking first.
- Do not claim that a build, push, deployment, or test succeeded unless you ran it and saw success.
- Avoid fragile assumptions about the EC2 instance. Check OS, CPU architecture, RAM, disk, Docker, Java, Jenkins, kubectl, and Minikube before proposing commands for the server.
- Keep the application port and Kubernetes Service port consistent.
- Use a unique image tag based on the Git commit SHA or build number, not only `latest`, so the second deployment can be demonstrated.
- Make the steps beginner-friendly and do one phase at a time. Do not dump a huge list of unrelated commands.

## Phase 1 — make the fresh website reliable
1. Inspect `package.json`, `src/`, and `index.html`.
2. Install dependencies if the environment permits.
3. Run `npm run build`.
4. Fix any actual errors and rerun the build.
5. Check the page for broken image URLs, React warnings, and obvious interaction errors. Product images should have sensible fallbacks.
6. Report exactly what passed and what still needs a manual browser check.

## Phase 2 — containerize the frontend
1. Create a production `Dockerfile` using a Node build stage and a small Nginx runtime stage.
2. Add an Nginx config if required so the Vite-built site serves correctly.
3. Add `.dockerignore`.
4. Build and run the container locally if Docker is available.
5. Verify the page responds on the chosen local port. If Docker is unavailable, provide exact commands for the user to run and do not claim success.
6. Do not copy `.env`, `.git`, `node_modules`, or credentials into the image.

## Phase 3 — Kubernetes files
Create `k8s/deployment.yaml` and `k8s/service.yaml` with:
- a clear app label and matching selectors;
- a configurable image name/tag;
- a suitable replica count for a small student demo;
- container port matching Nginx;
- basic readiness/liveness checks if appropriate;
- a Service that exposes the application for Minikube access.
Use a registry image that Minikube can pull. If a private registry is used, explain how to configure image pull credentials securely.

## Phase 4 — Jenkins pipeline
Create a declarative `Jenkinsfile` with clear stages:
1. Checkout source from the configured GitHub repository.
2. Build/test (`npm ci`, `npm run build`, and any existing checks).
3. Docker build.
4. Authenticate to Docker Hub using Jenkins Credentials Binding / `withCredentials`; never echo secrets.
5. Push a unique commit-SHA or build-number tag and optionally update `latest`.
6. Update the Kubernetes Deployment to use the exact image tag, apply manifests, wait for rollout, and verify pods/deployment/service.
7. Clean up local Docker images when safe.
Use placeholders for Jenkins credential IDs and Docker Hub namespace where the user must configure them. Make assumptions explicit. Do not assume Jenkins can access Minikube until that is verified. If Jenkins and Minikube run on different machines or in different execution environments, explain the required kubeconfig/agent arrangement rather than silently assuming access.

## Phase 5 — setup and evidence
Update `README.md` with:
- what the project is;
- local run/build commands;
- Docker build/run commands;
- AWS EC2 prerequisites and secure Jenkins access;
- required Jenkins plugins and credentials;
- Docker Hub setup;
- Minikube deployment and verification commands;
- how to change source code and demonstrate the second pipeline run;
- a screenshot checklist matching the assignment rubric;
- limitations: frontend-only demo; no real payment/backend.

Do not fabricate screenshot evidence. Do not commit real secrets. Keep generated files minimal and readable.

## First response expected from you
Begin by listing the files you inspected, run or describe the first verification (`npm run build`), fix concrete errors, and summarize the result. Then stop and ask before moving to the next phase if a decision or cloud-cost/security approval is required.


## Lightweight / AWS Free Tier constraints (important)
The site must be lightweight and realistic for a small EC2 instance, potentially a Free Tier-sized VM with around 1 GiB RAM. Do not assume a specific instance type or that all Free Tier accounts have the same eligibility/pricing. Check the actual instance type and current account terms before provisioning.

### Frontend constraints
- Keep React + Vite and the current simple storefront. Do not add heavy UI libraries, animation libraries, charting packages, state-management frameworks, or a backend/database.
- Keep dependencies minimal. Prefer CSS and existing `lucide-react` only; do not add more packages without a clear need.
- Use optimized responsive images with explicit dimensions/aspect ratios where practical, lazy-load below-the-fold product images, and provide reliable fallback images. Avoid autoplay video, large background video, and excessive animations.
- Keep the production bundle small. Run `npm run build` and report actual bundle sizes. Do not invent size targets or claim performance measurements unless measured.
- Make sure the page remains usable on mobile and on a slow connection.
- Do not require Node.js to run the deployed website in production. Build the static assets in a multi-stage Docker build, then serve them with a small Nginx Alpine image.
- Add an appropriate `.dockerignore` so `.git`, `node_modules`, local build output, logs, `.env*`, and credentials are excluded from the Docker build context. Do not exclude files required for the build.
- Do not put secrets or `.env` files into the image.

### EC2 / Docker / Kubernetes constraints
- Do not install Jenkins, Docker, Minikube, and a full build toolchain all at once until CPU, RAM, disk, and architecture have been checked. Jenkins + Docker + Minikube together may exceed a 1 GiB RAM instance and can fail or become unresponsive.
- Prefer building the image on a local development machine or CI worker and pushing it to Docker Hub; then pull the image on EC2/Minikube. If the assignment specifically requires Jenkins on AWS and Minikube on the same host, assess the resource requirements first and explain any Free Tier limitation. Do not silently substitute a different architecture that violates the assignment.
- If the chosen EC2 instance is too small for Jenkins + Minikube, stop and ask before recommending a larger instance or paid resource. Offer a cost-aware option and explain that AWS Free Tier eligibility depends on account age, region, instance type, usage, and current AWS terms.
- Use one small Nginx container for the static site, modest Kubernetes resource requests/limits, and one replica for the demo unless the assignment or environment requires otherwise.
- Avoid unnecessary background services, multiple replicas, monitoring stacks, databases, or extra containers.
- In the README, document the lightweight design and the memory/resource trade-offs honestly.
