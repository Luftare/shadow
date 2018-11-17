const {
  EVENT_SERVER_INIT_CLIENT,
  EVENT_CLIENT_UPDATE,
  EVENT_SERVER_UPDATE,
  EVENT_SERVER_INIT_NEW_GAME,
  CLIENT_SERVER_UPDATE_INTERVAL,
  PROPNAME_POSITION,
  PROPNAME_ID,
} = require('../shared/sharedConfig');

const {
  handleClientUpdate,
  removePlayer,
  addPlayer,
  getState,
  initModel,
  updateModel,
  updateModelAfterBroadcast,
  getIdlePlayers,
} = require('./model');

const sockets = {};

function startGameServer(io) {
  const handleNewGame = (state, winner) => {
    io.sockets.emit(EVENT_SERVER_INIT_NEW_GAME, { state, winner });
  };

  const handleBroadcastEvent = (eventName, payload) => {
    io.sockets.emit(eventName, payload);
  };

  initModel(handleNewGame, handleBroadcastEvent).then(() => {
    handleSocketConnections(io);

    setInterval(() => {
      updateModel();
      broadcastUpdateToClients(io);
    }, CLIENT_SERVER_UPDATE_INTERVAL);
  });
}

function clearIdlers() {
  const idlers = getIdlePlayers();
  idlers.forEach(player => {
    removePlayer(player[PROPNAME_ID]);
    const socket = sockets[player[PROPNAME_ID]];
    if (socket) {
      sockets[player[PROPNAME_ID]].disconnect();
      delete sockets[player[PROPNAME_ID]];
    }
  });
}

function broadcastUpdateToClients(io) {
  io.sockets.emit(EVENT_SERVER_UPDATE, getState());
  updateModelAfterBroadcast();
}

function addSocketHandlers(socket, io) {
  socket.on('disconnect', () => {
    delete sockets[socket.id];
    removePlayer(socket.id);
    clearIdlers();
  });

  socket.on(EVENT_CLIENT_UPDATE, update => {
    handleClientUpdate(socket.id, update);
  });
}

function handleNewClientConnection(socket) {
  sockets[socket.id] = socket;
  addPlayer(socket.id);
  socket.emit(EVENT_SERVER_INIT_CLIENT, socket.id);
}

function handleSocketConnections(io) {
  io.sockets.on('connection', socket => {
    addSocketHandlers(socket, io);
    handleNewClientConnection(socket, io);
    clearIdlers();
  });
}

module.exports = {
  startGameServer,
};
