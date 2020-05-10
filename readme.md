<center><img src="media/boxel.png" width="100%" alt="boxel"></center>

<img src="media/boxel.jpg" width="100%" alt="boxel">

Boxel is a wooden box that contains a Raspberry Pi and a 32x32 LED matrix.

A local HTTP server allows any device on the same network to act as a remote controller to choose among several modes: digital clock, weather stats and forecast, digital photo frame, and so on.

* 📸 **[Making-of & pictures](media)**
* 🛠️ **[Material](#material)**
* 🔌 **[Wiring](#wiring)**
* 🎛️ **[Available modes](#available-modes)**
* 💾 **[Software installation](#software-installation)**
* 💡 **[Credits](#credits)**

## Material

<img src="media/material.jpg" width="100%" alt="needed material">

* Raspberry Pi with a 40 pin GPIO header (tested with a `Pi 2 Model B Rev 1.1`)
* 32x32 LED matrix and its DC cable
* 14 female to female jumper wires
* DC to female 2.1mm Jack adapter
* 5V male Jack to male USB adapter (1A)
* Micro USB to USB adapter (2.4A)
* USB to AC adapter (5V 3.4A with 2 ports)
* USB Wi-Fi dongle
* A few wooden planks, screws, small shelf brackets

## Wiring

I could not find the original wiring schema that was used for this project, so here is the current one that works (the matrix must be powered with its own cable)

<img src="media/wiring.png" width="50%" alt="wiring">

|Matrix|R0|G0|B0|Ground|R1|G1|B1|A|B|C|D|CLK|STB|OE|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|GPIO|23|13|26|6|24|21|19|15|16|18|22|11|7|12|

## Available modes

* Digital clock ([source](app/modes/clock))
* Netatmo weather report ([source](app/modes/netatmo))
* Pomodoro ([source](app/modes/pomodoro))
* Random pixels ([source](app/modes/random))

## Software installation

### On the dev machine

Clone the project and install the dependencies:

```
git clone git@github.com:johansatge/boxel.git
cd boxel/app
npm install
```

Start the app in dry run (so it doesn't try to initialize the LED matrix):

```
node app/index.js --dry-run
```

### On the Raspberry Pi

#### Base install

* Use [Raspberry Pi Imager](https://www.raspberrypi.org/downloads/) to install the latest Raspbian on the SD card (tested version: `10 Buster`)
* From the GUI (`startx`), configure:
  * The user (`pi`), current date & time, location
  * The wifi
  * Enable SSH & [configure a key](https://www.raspberrypi.org/documentation/remote-access/ssh/passwordless.md) if needed
* Disable on-board sound in `/boot/config.txt` by setting `dtparam=audio=off`

#### Node.js

Install Node.js LTS (tested version: `node 12.16.2` / `npm 6.14.4`)

```
curl -sL https://deb.nodesource.com/setup_12.x | sudo bash -
sudo apt-get install nodejs
```

#### Project installation

From the dev machine, sync the app:

```bash
sh sync.sh
```

On the Pi, install the dependencies:

```bash
cd /home/pi/boxel-app
npm install
```

Create a state file and make sure it's writable:

```bash
touch /home/pi/boxel-app/.state.json
chmod 777 /home/pi/boxel-app/.state.json
# Todo: check what user is node using to give proper r/w permissions
```

Create a file to expose Netatmo credentials:

```bash
touch /home/pi/boxel-app/.netatmo.json
# The file looks like this:
# {
#   "clientId": "aaaa",
#   "clientSecret": "bbbb",
#   "username": "cccc",
#   "password": "dddd"
# }
```

Finally, start the app:

```bash
sudo node /home/pi/boxel-app/index.js
```

Or alternatively, start the app on the dev machine in dry run mode.
This will start the server but prevent the app from connecting to the matrix:

```bash
node index.js --dry-run
```

## Credits

* [hzeller/rpi-rgb-led-matrix](https://github.com/hzeller/rpi-rgb-led-matrix)
* [alexeden/rpi-led-matrix](https://github.com/alexeden/rpi-led-matrix) (Node binding for the original library)
* [Connecting a 16x32 RGB led matrix panel to a Raspberry Pi](https://learn.adafruit.com/connecting-a-16x32-rgb-led-matrix-panel-to-a-raspberry-pi/wiring-the-display)
