(() => {

  window.BoxelInitUi = () => {
    const shutdownButtonNode = document.querySelector('.js-shutdown')
    shutdownButtonNode.addEventListener('click', onShutdownRequest)
    setSpinner(true)
    const evtSource = new EventSource('/sse')
    evtSource.addEventListener('stateUpdate', onStateUpdate)
    evtSource.addEventListener('ping', onSsePing)
    document.querySelectorAll('.js-mode-set').forEach((node) => {
      node.addEventListener('click', onSetCurrentMode)
    })
    document.querySelectorAll('.js-select').forEach((node) => {
      setSelect(node)
      node.querySelector('.js-select-input').addEventListener('change', onSelectChange)
    })
  }

  window.BoxelApplyModeAction = (action, data = null) => {
    setSpinner(true)
    const encodedData = encodeURIComponent(JSON.stringify(data))
    fetchAndCatchError('/applycurrentmodeaction/' + action + '/' + encodedData)
  }

  let errorMessageTimeout = null
  window.BoxelShowError = (error) => {
    const errorMessageNode = document.querySelector('.js-error')
    errorMessageNode.innerText = error.message
    errorMessageNode.style.display = 'block'
    if (errorMessageTimeout !== null) {
      clearTimeout(errorMessageTimeout)
      errorMessageTimeout = null
    }
    errorMessageTimeout = setTimeout(() => {
      errorMessageNode.style.display = 'none'
    }, 3000)
  }

  const setSelect = (node) => {
    const currentText = node.querySelector('.js-select-input option:checked').innerText
    node.querySelector('.js-select-text').innerText = currentText
  }

  const onSelectChange = (evt) => {
    setSelect(evt.currentTarget.parentNode)
  }

  const setSpinner = (isDisplayed) => {
    const headerNode = document.querySelector('.js-header')
    headerNode.classList[isDisplayed ? 'add' : 'remove']('js-has-spinner')
  }

  const onShutdownRequest = () => {
    const confirmed = window.confirm('Are you sure?')
    if (confirmed) {
      shutdownButtonNode.disabled = true
      fetchAndCatchError('/shutdown')
    }
  }

  const onSetCurrentMode = (evt) => {
    setSpinner(true)
    fetchAndCatchError('/setcurrentmode/' + evt.currentTarget.dataset.mode)
  }

  const onStateUpdate = (evt) => {
    setSpinner(false)
    const state = JSON.parse(evt.data)
    console.log('Received state', state)
    document.querySelectorAll('.js-mode').forEach((modeNode) => {
      const modeId = modeNode.dataset.mode
      const method = modeId === state.currentModeId ? 'add' : 'remove'
      modeNode.classList[method]('js-current-mode')
      if (modeId === state.currentModeId && window.BoxelModes[modeId] && window.BoxelModes[modeId].onStateUpdate) {
        window.BoxelModes[modeId].onStateUpdate(state.currentModeData)
      }
    })
  }

  const fetchAndCatchError = (url) => {
    window.fetch(url)
      .then((response) => response.json())
      .then((json) => {
        if (json.error) {
          throw new Error(json.error)
        }
      })
      .catch((error) => {
        setSpinner(false)
        window.BoxelShowError(error)
      })
  }

  const onSsePing = () => {
    console.log('Received ping')
  }

})()
