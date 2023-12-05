/*建立一个 WebSocket 连接并允许外部代码注册消息接收的回调函数*/

//声明websocket服务器的地址和端口
const host = 'localhost:3001'

export let send
//建立websocket的函数
export const startWebsocketConnection = () => {
  const ws = new window.WebSocket('ws://' + host + '/chat') || {}
  //连接建立
  ws.onopen = () => {
    console.log('opened ws connection')
  }
  //连接关闭
  ws.onclose = (e) => {
    console.log('close ws connection: ', e.code, e.reason)
  }
  //
  ws.onmessage = (e) => {
    onMessageCallback && onMessageCallback(e.data)
  }

  send = ws.send.bind(ws)
}

let onMessageCallback
export const registerOnMessageCallback = (fn) => {
  onMessageCallback = fn
}
