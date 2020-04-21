(() => {

  window.BoxelInitUi = function() {
    const shutdownButtonNode = document.querySelector('.js-shutdown')
    shutdownButtonNode.addEventListener('click', onShutdownRequest)
    setSpinner(true)
    const evtSource = new EventSource('/sse')
    evtSource.addEventListener('stateUpdate', onSseStateUpdate)
    evtSource.addEventListener('ping', onSsePing)
    document.querySelectorAll('.js-mode-set').forEach((node) => {
      node.addEventListener('click', onSetMode)
    })
  }

  window.BoxelSetStateFromUi = function({ mode, data }) {
    setSpinner(true)
    const encodedData = encodeURIComponent(JSON.stringify(data))
    fetchAndCatchError('/setmodestate/' + mode + '/' + encodedData)
  }

  function setSpinner(isDisplayed) {
    const titleNode = document.querySelector('.js-title')
    titleNode.classList[isDisplayed ? 'add' : 'remove']('js-has-spinner')
  }

  function onShutdownRequest() {
    const confirmed = window.confirm('Are you sure?')
    if (confirmed) {
      shutdownButtonNode.disabled = true
      fetchAndCatchError('/shutdown')
    }
  }

  function onSetMode(evt) {
    setSpinner(true)
    fetchAndCatchError('/setmode/' + evt.currentTarget.dataset.mode)
  }

  function onSseStateUpdate(evt) {
    setSpinner(false)
    const state = JSON.parse(evt.data)
    console.log('Received state', state)
    document.querySelectorAll('.js-mode').forEach((modeNode) => {
      const modeId = modeNode.dataset.mode
      const method = modeId === state.currentMode ? 'add' : 'remove'
      modeNode.classList[method]('js-current-mode')
      if (state.data[modeId] && window.BoxelModes[modeId] && window.BoxelModes[modeId].setUiFromState) {
        window.BoxelModes[modeId].setUiFromState(state.data[modeId])
      }
    })
  }

  function fetchAndCatchError(url) {
    window.fetch(url)
      .then((response) => response.json())
      .then((json) => {
        if (json.error) {
          throw new Error(json.error)
        }
      })
      .catch((error) => {
        setSpinner(false)
        console.warn(`Error when requesting ${url}`, error)
      })
  }

  function onSsePing() {
    console.log('Received ping')
  }

})()
