const socket = require('./socket');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 8000;

app.use('/', express.static(__dirname + './../client'));
app.use('/', express.static(__dirname + './../shared'));
app.use('/', express.static(__dirname + '/node_modules/socket.io-client/dist'));

socket.handleSocketConnections(io);

http.listen(port);
