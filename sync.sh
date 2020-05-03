#!/bin/bash
echo "Syncing files to pi"
rsync app pi@192.168.1.6:/home/pi/boxel-app \
  --delete \
  --recursive \
  --exclude=.DS_Store \
  --exclude=node_modules \
  --exclude=.state.json
