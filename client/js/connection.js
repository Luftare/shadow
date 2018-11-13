const connection = (function() {
  const {
    EVENT_SERVER_INIT_CLIENT,
    EVENT_CLIENT_UPDATE,
    EVENT_SERVER_UPDATE,
    EVENT_SERVER_INIT_NEW_GAME,
    PROPNAME_TYPE,
    PROPNAME_POSITION,
    PROPNAME_PAYLOAD,
    PROPNAME_ID,
    PROPNAME_RECEIVE_HIT,
    PROPNAME_GUN_SHOT,
  } = sharedConfig;

  return {
    socket: null,
    id: null,
    clientUpdates: [],
    lastUpdateTime: 0,
    requestUpdate() {
      const now = Date.now();
      const sinceLastUpdate = now - this.lastUpdateTime;
      const enoughTimeFromLastUpdate =
        sinceLastUpdate >= sharedConfig.CLIENT_SERVER_UPDATE_INTERVAL;

      if (enoughTimeFromLastUpdate) {
        this.lastUpdateTime = now;
        this.emitUpdates();
      }
    },
    connectToServerSocket(state) {
      return new Promise(resolve => {
        const socket = io();

        socket.on(EVENT_SERVER_INIT_NEW_GAME, data => {
          syncController.handleInitNewGame(data, state);
        });

        socket.on(EVENT_SERVER_INIT_CLIENT, initData => {
          this.id = initData[PROPNAME_ID];
          state.player.position = initData[PROPNAME_POSITION];
          resolve();
        });

        socket.on(EVENT_SERVER_UPDATE, serverState => {
          syncController.handleReceivedStateFromServer(serverState, state);
        });

        socket.on('disconnect', () => {
          alert('Disconnected.');
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
    appendGunHit(opponentId) {
      this.clientUpdates.push({
        [PROPNAME_TYPE]: PROPNAME_RECEIVE_HIT,
        [PROPNAME_PAYLOAD]: opponentId,
      });
    },
    appendGunShot(from, to) {
      this.clientUpdates.push({
        [PROPNAME_TYPE]: PROPNAME_GUN_SHOT,
        [PROPNAME_PAYLOAD]: { from, to },
      });
    },
    emitUpdates() {
      this.socket.emit(EVENT_CLIENT_UPDATE, this.clientUpdates);
      this.clientUpdates = [];
    },
  };
})();
