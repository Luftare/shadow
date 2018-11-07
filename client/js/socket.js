const connection = (function() {
  const {
    EVENT_SERVER_INIT_CLIENT,
    EVENT_CLIENT_UPDATE,
    EVENT_SERVER_UPDATE,
    PROPNAME_TYPE,
    PROPNAME_POSITION,
    PROPNAME_PAYLOAD,
  } = sharedSocketConfig;

  return {
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
      return new Promise(resolve => {
        const socket = io();

        socket.on(EVENT_SERVER_INIT_CLIENT, data => {
          resolve();
        });

        socket.on(EVENT_SERVER_UPDATE, serverState => {});

        this.socket = socket;
      });
    },
    appendNewPosition(position) {
      this.clientUpdates.push({
        [PROPNAME_TYPE]: PROPNAME_POSITION,
        [PROPNAME_PAYLOAD]: position,
      });
    },
    emitUpdates() {
      this.socket.emit(EVENT_CLIENT_UPDATE, this.clientUpdates);
      this.clientUpdates = [];
    },
  };
})();
