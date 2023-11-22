const host = 'localhost:3001'

export let send

export const startWebsocketConnection = () => {
  const ws = new window.WebSocket('ws://' + host + '/chat') || {}
  ws.onopen = () => {
    console.log('opened ws connection')
  }

  ws.onclose = (e) => {
    console.log('close ws connection: ', e.code, e.reason)
  }

  ws.onmessage = (e) => {
    onMessageCallback && onMessageCallback(e.data)
  }

  send = ws.send.bind(ws)
}

let onMessageCallback
export const registerOnMessageCallback = (fn) => {
  onMessageCallback = fn
}
