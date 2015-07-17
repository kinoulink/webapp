.PHONY: deploy

deploy:

	grunt build

	grunt compress

	rsync -azv \
	--delete-after \
	--exclude .git \
	--exclude .DS_Store  \
	--exclude .idea  \
	--exclude composer.*  \
	dist/ k-prod.cloudapp.net:/var/kinoulink/webapp/build