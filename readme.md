# Boxel

## Installation

### On the dev machine

Clone the project and install the dependencies:

```
git clone git@github.com:johansatge/boxel.git
cd boxel
npm install
```

### On the Raspberry Pi

#### Base install

* Use [Raspberry Pi Imager](https://www.raspberrypi.org/downloads/) to install the latest Raspbian on the SD card (tested version: `10 Buster`)
* From the GUI (`startx`), configure:
* The user (`pi`), date, location
* The wifi
* Enable SSH & [configure a key](https://www.raspberrypi.org/documentation/remote-access/ssh/passwordless.md) if needed
* Disable on-board sound in `/boot/config.txt` by setting `dtparam=audio=off`

#### Node JS

Install Node JS LTS (tested version: `node 12.16.2` / `npm 6.14.4`)

```
curl -sL https://deb.nodesource.com/setup_12.x | sudo bash -
sudo apt-get install nodejs
```

#### Project installation

From the dev machine, sync the project and start the service:

```
sh sync-and-start.sh
```

The first time, dependencies must be installed on the Pi:

```
cd /home/pi/boxel
npm install
```
