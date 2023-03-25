#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
APP="$SCRIPT_DIR/webshackle.js"

if [[ "$1" == "on" ]]; then
  sudo pm2 start "$APP"
  echo "WebShackle has been started"
elif [[ "$1" == "off" ]]; then
  sudo pm2 stop "$APP"
  sudo sed -i.bak '/WebShackle/d' /etc/hosts
  sudo sed -i -E '/WebShackle$/d;/^[[:space:]]*$/d' /etc/hosts
  echo "WebShackle has been stopped and blocking entries removed"
else
  echo "Usage: shackle [on|off]"
  exit 1
fi
