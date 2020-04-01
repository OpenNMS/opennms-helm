## 
# Makefile to build the documentation with Antora
##
.PHONY: help deps-native deps-with-docker native with-docker clean

.DEFAULT_GOAL := native

SHELL                := /bin/bash -o nounset -o pipefail -o errexit
WORKING_DIRECTORY    := $(shell pwd)
DOCKER_ANTORA_IMAGE  := antora/antora:2.2.0
SITE_FILE            := local-site.yml

help:
	@echo ""
	@echo "Makefile to build Antora based documentation with Docker or native installed."
	@echo "For the native version, please install globally Antora described on https://docs.antora.org/"
	@echo ""
	@echo "Requirements to build the docs:"
	@echo "  * Native: Antora installed globally with antora binary in the search path"
	@echo "  * Docker: Docker installed with access to the official antora/antora image on DockerHub"
	@echo ""
	@echo "Targets:"
	@echo "  help:             Show this help"
	@echo "  deps-native:      Test requirements to run Antora from the local system"
	@echo "  deps-with-docker: Test requirements to run Antora with Docker"
	@echo "  native:           Run Antora installed on the local system, default target"
	@echo "  with-docker:      Run Antora with Docker"
	@echo "  clean:            Clean all build artifacts in build and public directory"
	@echo ""
	@echo "Arguments: "
	@echo "  DOCKER_ANTORA_IMAGE: Antora Docker image to build the documenation, default: $(DOCKER_ANTORA_IMAGE)"
	@echo "  SITE_FILE:           Antora site.yml file to build the site"
	@echo ""
	@echo "Example: "
	@echo "  make DOCKER_ANTORA_IMAGE=antora/antora:latest with-docker"
	@echo ""

deps-native:
	@command -v antora

deps-with-docker:
	@command -v docker

native: deps-native
	@
	antora --stacktrace generate $(SITE_FILE)

with-docker: deps-with-docker
	@echo "Build Antora docs with docker ..."
	docker run --rm -v $(WORKING_DIRECTORY):/antora $(DOCKER_ANTORA_IMAGE) --stacktrace generate $(SITE_FILE)

clean:
	@echo "Delete build and public artifacts ..."
	@rm -rf build public
