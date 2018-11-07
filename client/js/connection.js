const connection = (function() {
  const {
    EVENT_SERVER_INIT_CLIENT,
    EVENT_CLIENT_UPDATE,
    EVENT_SERVER_UPDATE,
    PROPNAME_TYPE,
    PROPNAME_POSITION,
    PROPNAME_PAYLOAD,
    PROPNAME_ID,
  } = sharedSocketConfig;

  return {
    socket: null,
    id: null,
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

        socket.on(EVENT_SERVER_INIT_CLIENT, initData => {
          this.id = initData[PROPNAME_ID];
          state.player.position = initData[PROPNAME_POSITION];
          resolve();
        });

        socket.on(EVENT_SERVER_UPDATE, serverState => {
          syncController.handleReceivedStateFromServer(serverState, state);
        });

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
