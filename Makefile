STATE_REPOSITORY="$(MC_STATE_ACCOUNT).dkr.ecr.us-east-2.amazonaws.com/sigma"
STAGING_REPOSITORY="$(MC_STAGING_ACCOUNT).dkr.ecr.us-east-2.amazonaws.com/sigma"
PRODUCTION_REPOSITORY="$(MC_PRODUCTION_ACCOUNT).dkr.ecr.us-east-2.amazonaws.com/sigma"

TAG=`git describe --abbrev=1 --tags --always`

STATE_IMAGE="$(STATE_REPOSITORY):$(TAG)"
STAGING_IMAGE="$(STAGING_REPOSITORY):$(TAG)"
PRODUCTION_IMAGE="$(PRODUCTION_REPOSITORY):$(TAG)"

STATE_PROFILE?=metalcore-deploy-state
STAGING_PROFILE?=metalcore-deploy-staging
PRODUCTION_PROFILE?=metalcore-deploy-production

STAGING_BUCKET=portal-staging.metalcoregame.com
STAGING_CLOUDFRONT_DISTRIBUTION=E16CE3DKX7L2NT
STAGING_PROFILE?=metalcore-staging

PRODUCTION_BUCKET=portal.metalcoregame.com
PRODUCTION_CLOUDFRONT_DISTRIBUTION=E2TSN2XGMI4ZKZ
PRODUCTION_PROFILE?=metalcore-production

NO_COLOR='\033[0m'
RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
BLUE='\033[0;34m'

NODE_ENV?=production

default: build

tag:
	@echo "Current tag is '$(TAG)'"

image:
	@echo "Current image is '$(STATE_IMAGE)'"

login:
	`aws ecr get-login --no-include-email --profile=$(STATE_PROFILE) --region=$(MC_DEFAULT_REGION)`

push: login
	@echo -e $(GREEN) "Pushing image to AWS." $(NO_COLOR)
	@docker push $(STATE_IMAGE)

build-staging:
	@echo -e $(GREEN) "Building staging." $(NO_COLOR)
	@docker build -t $(STATE_IMAGE) . --build-arg APP_ENV=staging

use-staging:
	@echo -e $(GREEN) "Using staging." $(NO_COLOR)
	@aws eks update-kubeconfig --profile=$(STAGING_PROFILE) --name kubernetes-staging-v1 --region=$(MC_DEFAULT_REGION)

invalidate-staging:
	@echo -e $(GREEN) "Invalidating staging cache." $(NO_COLOR)
	@aws cloudfront --profile=$(STAGING_PROFILE) create-invalidation --distribution-id $(STAGING_CLOUDFRONT_DISTRIBUTION) --paths '/*'

deploy-staging: build-staging push use-staging invalidate-staging
	@echo -e $(GREEN) "Deployed to staging." $(NO_COLOR)
	@kubectl set image deployment/sigma-api sigma=$(STAGING_IMAGE) -n sigma

build-production:
	@echo -e $(GREEN) "Building production." $(NO_COLOR)
	@docker build -t $(STATE_IMAGE) . --build-arg APP_ENV=production

use-production:
	@echo -e $(GREEN) "Using production." $(NO_COLOR)
	@aws eks update-kubeconfig --profile=$(PRODUCTION_PROFILE) --name production-v1 --region=$(MC_DEFAULT_REGION)

invalidate-production:
	@echo -e $(GREEN) "Invalidating production cache." $(NO_COLOR)
	@aws cloudfront  --profile=$(PRODUCTION_PROFILE) create-invalidation --distribution-id $(PRODUCTION_CLOUDFRONT_DISTRIBUTION) --paths '/*'

deploy-production: build-production push use-production invalidate-production
	@echo -e $(GREEN) "Deployed to production." $(NO_COLOR)
	@kubectl set image deployment/sigma-api sigma=$(PRODUCTION_IMAGE) -n sigma
