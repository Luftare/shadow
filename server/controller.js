const {
  EVENT_SERVER_INIT_CLIENT,
  EVENT_CLIENT_UPDATE,
  EVENT_SERVER_UPDATE,
  CLIENT_SERVER_UPDATE_INTERVAL,
  PROPNAME_POSITION,
  PROPNAME_ID,
} = require('../shared/sharedSocketConfig');

const {
  handleClientUpdates,
  removePlayer,
  addPlayer,
  getState,
  updateModel,
} = require('./model');

function startGameServer(io) {
  handleSocketConnections(io);

  setInterval(() => {
    updateModel();
    broadcastUpdateToClients(io);
  }, CLIENT_SERVER_UPDATE_INTERVAL);
}

function broadcastUpdateToClients(io) {
  io.sockets.emit(EVENT_SERVER_UPDATE, getState());
}

function addSocketHandlers(socket, io) {
  socket.on('disconnect', () => {
    removePlayer(socket.id);
  });

  socket.on(EVENT_CLIENT_UPDATE, updates => {
    handleClientUpdates(socket.id, updates);
  });
}

function handleNewClientConnection(socket, io) {
  const position = addPlayer(socket.id);

  const initData = {
    [PROPNAME_POSITION]: position,
    [PROPNAME_ID]: socket.id,
  };

  socket.emit(EVENT_SERVER_INIT_CLIENT, initData);
}

function handleSocketConnections(io) {
  io.sockets.on('connection', socket => {
    addSocketHandlers(socket, io);
    handleNewClientConnection(socket, io);
  });
}

module.exports = {
  startGameServer,
};
