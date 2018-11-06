const { SERVER_INIT_CLIENT } = require('../shared/sharedSocketConfig');

function handleSocketConnections(io) {
  io.sockets.on('connection', socket => {
    socket.emit(SERVER_INIT_CLIENT, 'Connection established.');
    console.log('Client connected with id of ' + socket.id);
  });
}

module.exports = {
  handleSocketConnections,
};
