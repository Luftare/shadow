const connection = {
  socket: null,
  clientUpdates: [],
  lastUpdateTime: 0,
  requestUpdate() {
    const now = Date.now();
    const sinceLastUpdate = now - this.lastUpdateTime;
    const enoughTimeFromLastUpdate =
      sinceLastUpdate >= sharedSocketConfig.CLIENT_SERVER_UPDATE_INTERVAL;

    if (enoughTimeFromLastUpdate) {
      this.lastUpdateTime = now;
      this.emitUpdates();
    }
  },
  connectToServerSocket(state) {
    const { EVENT_SERVER_INIT_CLIENT } = sharedSocketConfig;

    return new Promise(resolve => {
      const socket = io();

      socket.on(EVENT_SERVER_INIT_CLIENT, data => {
        resolve();
      });

      this.socket = socket;
    });
  },
  appendNewPosition(position) {
    const {
      CLIENT_UPDATE_TYPE,
      CLIENT_UPDATE_POSITION,
      SOCKET_PAYLOAD,
    } = sharedSocketConfig;

    this.clientUpdates.push({
      [CLIENT_UPDATE_TYPE]: CLIENT_UPDATE_POSITION,
      [SOCKET_PAYLOAD]: position,
    });
  },
  emitUpdates() {
    const { EVENT_CLIENT_UPDATE } = sharedSocketConfig;

    this.socket.emit(EVENT_CLIENT_UPDATE, this.clientUpdates);
    this.clientUpdates = [];
  },
};
