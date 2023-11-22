const express = require("express");
const expressWs = require('express-ws');
const cors = require("cors");

const port = 3001;
const app = express();

expressWs(app)
const connections = new Set()

const wsHandler = (ws) => {
  connections.add(ws)
  ws.on('message', (message) => {
    connections.forEach((conn) => conn.send(message))
  })
  ws.on('close', () => {
    connections.delete(ws)
  })
}
app.ws('/chat', wsHandler)
app.use(express.static('build'))

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});