const {
  EVENT_SERVER_INIT_CLIENT,
  EVENT_CLIENT_UPDATE,
} = require('../shared/sharedSocketConfig');

const {
  handleClientUpdates,
  removePlayer,
  addPlayer,
  getState,
} = require('./model');

function addSocketHandlers(socket, io) {
  socket.on('disconnect', () => {
    removePlayer(socket.id);
  });

  socket.on(EVENT_CLIENT_UPDATE, updates => {
    handleClientUpdates(socket.id, updates);
  });
}

function handleSocketConnection(socket, io) {
  addPlayer(socket.id);

  socket.emit(EVENT_SERVER_INIT_CLIENT, getState());
}

function handleSocketConnections(io) {
  io.sockets.on('connection', socket => {
    addSocketHandlers(socket, io);
    handleSocketConnection(socket, io);
  });
}

module.exports = {
  handleSocketConnections,
};
