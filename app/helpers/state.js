const fs = require('fs').promises
const { log } = require('./log.js')
const path = require('path')

const m = {}
module.exports = m

const statePath = path.join(__dirname, '../.state.json')

let cachedState = null
let cachedModes = null
let cachedRunningModeId = null

/**
 * Load available modes from the disk and store the node modules in memory
 * This is called when starting the app
 *
 * @return {undefined}
 */
m.loadModesFromDisk = () => {
  return fs.readdir(path.join(__dirname, '../modes'), { withFileTypes: true })
    .then((list) => {
      cachedModes = {}
      list.filter((entry) => entry.isDirectory() && !entry.name.match(/^\./)).forEach((entry) => {
        cachedModes[entry.name] = require(path.join(__dirname, '../modes', entry.name, '/index.js'))
      })
      log(`Loaded modes ${Object.keys(cachedModes).join(', ')}`)
    })
}

/**
 * Return available modes in a readable format
 * This is used when the UI is requested in the HTTP server
 *
 * @param {Object[]} modes - The list of modes
 * @param {string} modes[].id - Mode id (the name of its directory)
 * @param {string} modes[].title - Mode title (returned by the mode)
 * @param {string} modes[].description - Mode description (returned by the mode)
 */
m.getAvailableModes = () => {
  return Object.keys(cachedModes).map((modeId) => {
    return {
      id: modeId,
      title: cachedModes[modeId].getTitle(),
      description: cachedModes[modeId].getDescription(),
    }
  })
}

/**
 * Load state from the disk and store it in memory
 * This is called when starting the app
 * Note the current mode is validated, but not each mode data
 * (Sanitizing a mode's data is done when activating the mode in question)
 *
 * @return {undefined}
 */
m.loadStateFromDisk = () => {
  return fs.readFile(statePath, 'utf8')
    .then((contents) => JSON.parse(contents))
    .catch((error) => {
      log(`Could not read state, defaulted (${error.message})`)
      return {}
    })
    .then((diskState) => {
      cachedState = {
        currentModeId: isValidMode(diskState.currentModeId) ? diskState.currentModeId : 'clock',
        modesData: diskState.modesData,
      }
      log(`Loaded state: ${m.getStateAsJson()}`)
    })
}

/**
 * Return the current in-memory state as JSON
 * This is used in the HTTP server to output the current state

 * @return {string} The state as a stringified JSON
 */
m.getStateAsJson = () => {
  return JSON.stringify(cachedState, null, 2)
}

/**
 * Set the current mode, if it's valid
 * Then start it (and stop the previous one if needed)
 * Starting a mode is synchronous
 *
 * @param {string} modeId - The ID of the mode (the name of its directory)
 * @return {undefined}
 */
m.setStateCurrentModeId = (modeId) => {
  if (!isValidMode(modeId)) {
    throw new Error('Invalid mode ID')
  }
  cachedState.currentModeId = modeId
  m.startCurrentMode()
}

/**
 * Apply an action to the current mode
 * This is called when the user interacts with the UI,
 * and the window.BoxelApplyModeAction() helper is called from the current mode (in the frontend)
 * - The requested action and associated data are forwarded to the current mode
 * - The sanitized data is returned and stored in the current in-memory state
 * - The state is written on disk asynchronously

 * @param {string} action - Action name (example: "setSettings")
 * @param {Object} rawData - Action data (an object that depends on the current mode,
 *                           computed in the frontend by reading the mode form
 * @return {undefined}
 */
m.applyCurrentModeAction = (action, rawData) => {
  const updatedModeData = cachedModes[cachedRunningModeId].applyModeAction(action, rawData)
  cachedState.modesData[cachedState.currentModeId] = updatedModeData
  log(`Saved current mode data (${JSON.stringify(updatedModeData)})`)
  writeState()
}

/**
 * Return the current mode ID
 * This is used in the HTTP server to forward the current state of the app to clients
 *
 * @return {string}
 */
m.getCurrentModeId = () => {
  return cachedState.currentModeId
}

/**
 * Return the current mode data
 * This is used in the HTTP server to forward the current state of the app to clients
 *
 * @return {Object}
 */
m.getCurrentModeData = () => {
  return cachedState.modesData[cachedState.currentModeId] || {}
}

/**
 * Start the current mode:
 * - Stop the previous mode, if there is one
 * - Start the requested mode (the one set in the state) and pass its data
 * - The data is sanitized and returned by the mode itself, and stored back in the state
 * This is useful if the mode data stored in the on-disk state is invalid or obsolete
 *
 * @return {undefined}
 */
m.startCurrentMode = () => {
  if (cachedRunningModeId !== null) {
    cachedModes[cachedRunningModeId].stopMode()
    log(`Stopped mode ${cachedRunningModeId}`)
  }
  const initialData = cachedModes[cachedState.currentModeId].startMode(m.getCurrentModeData())
  cachedState.modesData[cachedState.currentModeId] = initialData
  log(`Started mode ${cachedState.currentModeId}`)
  cachedRunningModeId = cachedState.currentModeId
  writeState()
}

/**
 * Check if the given mode exists
 * This is used when loading the state from disk, or when a user sets the current mode in the UI
 *
 * @param {string} modeId - ID of the mode
 * @return {boolean} If the mode exists
 */
const isValidMode = (modeId) => {
  return typeof modeId === 'string' && typeof cachedModes[modeId] === 'object'
}

/**
 * Write the in-memory state to the disk
 * This is an async operation, that doesn't block the main thread
 * This is called when setting the current mode, or applying an action to the current mode
 *
 * @return {undefined}
 */
const writeState = () => {
  fs.writeFile(statePath, JSON.stringify(cachedState, null, 2), 'utf8')
    .then(() => {
      log('Wrote state to disk')
    })
    .catch((error) => {
      log(`Could not write state to disk (${error.message})`)
    })
}
