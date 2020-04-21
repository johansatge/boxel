# Boxel

## Installation

### Raspberry Pi

* Use [Raspberry Pi Imager](https://www.raspberrypi.org/downloads/) to install the latest Raspbian on the SD card (tested version: `10 Buster`)
* From the GUI (`startx`), configure:
* The user (`pi`), date, location
* The wifi
* Enable SSH & [configure a key](https://www.raspberrypi.org/documentation/remote-access/ssh/passwordless.md) if needed
* Disable on-board sound in `/boot/config.txt` by setting `dtparam=audio=off`

### Node JS

Install Node JS LTS (tested version: `node 12.16.2` / `npm 6.14.4`)

```
curl -sL https://deb.nodesource.com/setup_12.x | sudo bash -
sudo apt-get install nodejs
```

### Project installation

Install the project (without dependencies):

```
sh sync.sh
```

On the device, install the dependencies:

```
cd /home/pi/boxel
npm install
```
