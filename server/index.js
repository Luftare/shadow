const express = require('express');
const app = express();
const http = require('http').Server(app);
const port = 8000;

app.use('/', express.static(__dirname + './../client'));

http.listen(port);
