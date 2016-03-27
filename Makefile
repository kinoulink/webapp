.PHONY: deploy

deploy:

	gulp clean:all

	gulp version:release

	NODE_ENV=local gulp build
	NODE_ENV=dev gulp build
	NODE_ENV=prod gulp build