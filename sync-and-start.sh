#!/bin/bash
echo "Syncing files to pi"
rsync . pi@192.168.1.6:/home/pi/boxel \
  --delete \
  --recursive \
  --exclude=.DS_Store \
  --exclude=.git \
  --exclude=node_modules
echo "Connecting to pi"
ssh pi@192.168.1.6 'bash -s' << "ENDSSH"
echo "Killing existing process"
ps -ef | grep "pi/boxel" | grep -v "grep" | awk '{print $2}' | sudo xargs kill
echo "Starting new process"
sudo node /home/pi/boxel/index.js &
ENDSSH
