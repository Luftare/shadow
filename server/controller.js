const {
  EVENT_SERVER_INIT_CLIENT,
  EVENT_CLIENT_UPDATE,
  EVENT_SERVER_UPDATE,
  EVENT_SERVER_INIT_NEW_GAME,
  CLIENT_SERVER_UPDATE_INTERVAL,
  PROPNAME_POSITION,
  PROPNAME_ID,
  IDLE_KICK_TIME,
} = require('../shared/sharedSocketConfig');

const {
  handleClientUpdates,
  removePlayer,
  addPlayer,
  getState,
  initModel,
  updateModel,
  updateModelAfterBroadcast,
} = require('./model');

function startGameServer(io) {
  handleSocketConnections(io);

  initModel(data => {
    io.sockets.emit(EVENT_SERVER_INIT_NEW_GAME, data);
  });

  setInterval(() => {
    updateModel();
    broadcastUpdateToClients(io);
  }, CLIENT_SERVER_UPDATE_INTERVAL);
}

function broadcastUpdateToClients(io) {
  io.sockets.emit(EVENT_SERVER_UPDATE, getState());
  updateModelAfterBroadcast();
}

function addSocketHandlers(socket, io) {
  let disconnectTimeoutId = setTimeout(() => {
    socket.disconnect();
  }, IDLE_KICK_TIME);

  socket.on('disconnect', () => {
    removePlayer(socket.id);
  });

  socket.on(EVENT_CLIENT_UPDATE, updates => {
    if (updates.length > 0) {
      clearTimeout(disconnectTimeoutId);
      disconnectTimeoutId = setTimeout(() => {
        socket.disconnect();
      }, IDLE_KICK_TIME);
    }

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
