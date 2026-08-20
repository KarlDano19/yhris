push-staging1: ## Example: make push-staging1 branch=main
	@if [ -z "$(branch)" ]; then \
		echo "Usage: make push-staging1 branch=<branch-name>"; \
		exit 1; \
	fi
	@git checkout ${branch}
	@echo "Verifying package-lock.json is in sync with package.json on ${branch}..."
	@npm ci --dry-run || (echo "\n❌ package-lock.json is out of sync on ${branch}. Run 'npm install', commit the updated lock file, then try again." && exit 1)
	@git checkout staging1
	@git reset --hard ${branch}
	@git push origin staging1 --force
	@git checkout ${branch}