#!/bin/bash
echo $DOCKER_USERNAME
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker push piotrmoszkowicz/netguru