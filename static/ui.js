(() => {

  window.BoxelInitUi = function() {
    const shutdownButtonNode = document.querySelector('.js-shutdown')
    shutdownButtonNode.addEventListener('click', onShutdownRequest)
    setSpinner(true)
    const evtSource = new EventSource('/sse')
    evtSource.addEventListener('stateUpdate', onStateUpdate)
    evtSource.addEventListener('ping', onSsePing)
    document.querySelectorAll('.js-mode-set').forEach((node) => {
      node.addEventListener('click', onSetCurrentMode)
    })
  }

  window.BoxelSetCurrentModeData = function(data) {
    setSpinner(true)
    const encodedData = encodeURIComponent(JSON.stringify(data))
    fetchAndCatchError('/setcurrentmodedata/' + encodedData)
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

  function onSetCurrentMode(evt) {
    setSpinner(true)
    fetchAndCatchError('/setcurrentmode/' + evt.currentTarget.dataset.mode)
  }

  function onStateUpdate(evt) {
    setSpinner(false)
    const state = JSON.parse(evt.data)
    console.log('Received state', state)
    document.querySelectorAll('.js-mode').forEach((modeNode) => {
      const modeId = modeNode.dataset.mode
      const method = modeId === state.currentModeId ? 'add' : 'remove'
      modeNode.classList[method]('js-current-mode')
      // @todo only update state if it changed
      if (modeId === state.currentModeId && window.BoxelModes[modeId] && window.BoxelModes[modeId].onStateUpdate) {
        window.BoxelModes[modeId].onStateUpdate(state.currentModeData)
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
