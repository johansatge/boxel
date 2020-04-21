rsync . pi@192.168.1.6:/home/pi/boxel \
  --verbose \
  --delete \
  --recursive \
  --exclude=.DS_Store \
  --exclude=.git \
  --exclude=node_modules
