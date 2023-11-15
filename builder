#!/bin/bash

project_name="json-form-editor"
image_name=${project_name}:0.9
server_implementation="none"


#
# Run a development container with the source worktree mounted
#
run_development_container() {
      docker run -it --rm --name ${project_name}-dev-container \
      -v $(pwd):/src \
      -p 3000:3000 \
      -p 443:443 \
      -p 80:80 \
      -e ADMIN_USERNAME=admin \
      -e ADMIN_PASSWORD=admin \
      -e OFFLINE_MODE=false \
      -e SERVER_IMPLEMENTATION=${server_implementation} \
      alpine:latest sh -c 'apk update && apk add bash && cd /src && ./builder setup_development_container && cd /src && ./builder start_development_container_services && echo "Connect to http://localhost:3000 to run the desktop, or run \"./builder test_dev_container\" to validate the UI server" && sh'
}


#
# Start the React dev server
#
start_development_container_services() {
  echo "Starting UI dev server..."
  cd /src && nohup yarn start &
  echo "The UI server log is available in ./ui/nohup.out"
  echo "Waiting for server to start (10 seconds)...."
  sleep 10
  tail -f nohup.out &
  echo ""
  sh
}


#
# Setup a dev container.  Note that this is called from etc/Dockerfile_dev
#
setup_development_container() {
      cd /src
      mkdir /node_modules
      ln -s /node_modules /src/node_modules 2>/dev/null
      apk update
      apk add bash jq curl git yarn
      yarn install
}


#
# Show available commands
#
help() {
  echo ""
  echo "Usage: "
  echo ""
  echo "  $0 <command>"
  echo ""
  echo "Suggestion: "
  echo ""
  echo "  $0 run_development_container"
  echo ""
  echo "Commands:"
  echo ""
  cat $0 | grep -v '##' | grep '()' | grep -v cat | cut -f1 -d'(' | sed 's/^/  /g'
  echo ""
}

#
# Start of program
#
if [ $# -eq 0 ]; then
  help ""
else
  $@
fi







