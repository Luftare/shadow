const { startGameServer } = require('./controller');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  pingTimeout: 2000,
  pingInterval: 2000,
  cookie: false,
});

const port = process.env.PORT || 8000;

app.use('/', express.static(__dirname + '/client'));
app.use('/', express.static(__dirname + '/shared'));
app.use('/', express.static(__dirname + '/node_modules/socket.io-client/dist'));

startGameServer(io);

http.listen(port);
