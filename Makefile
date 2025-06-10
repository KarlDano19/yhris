push-staging1: ## Example: make push-staging1 branch=main
	@git checkout staging1
	@git reset --hard ${branch}
	@git push origin staging1 --force
	@git checkout ${branch}