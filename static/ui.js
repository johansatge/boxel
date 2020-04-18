(() => {

  window.BoxelInitUi = function() {
    const shutdownButtonNode = document.querySelector('.js-shutdown')
    shutdownButtonNode.addEventListener('click', onShutdownRequest)
    const evtSource = new EventSource('/sse')
    evtSource.addEventListener('stateUpdate', onSseStateUpdate)
    evtSource.addEventListener('ping', onSsePing)
    document.querySelectorAll('.js-mode-set').forEach((node) => {
      node.addEventListener('click', onSetMode)
    })
  }

  window.BoxelSetStateFromUi = function({ mode, data }) {
    const encodedData = encodeURIComponent(JSON.stringify(data))
    window.fetch('/setstate?mode=' + mode + '&data=' + encodedData)
  }

  function onShutdownRequest() {
    const confirmed = window.confirm('Are you sure?')
    if (confirmed) {
      shutdownButtonNode.disabled = true
      window.fetch('/shutdown').then(() => {
        shutdownButtonNode.disabled = false
      })
    }
  }

  function onSetMode(evt) {
    fetch('/setmode/' + evt.currentTarget.dataset.mode)
  }

  function onSseStateUpdate(evt) {
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

  function onSsePing() {
    console.log('Received ping')
  }
})()
