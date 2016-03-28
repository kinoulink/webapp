.PHONY: deploy

deploy:

	gulp clean:all

	mkdir -p gen/builds/src

	gulp version:patch

	NODE_ENV=local gulp build
	NODE_ENV=dev gulp build
	NODE_ENV=prod gulp build