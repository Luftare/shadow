const connection = (function() {
  const {
    EVENT_SERVER_INIT_CLIENT,
    EVENT_CLIENT_UPDATE,
    EVENT_SERVER_UPDATE,
    EVENT_SERVER_INIT_NEW_GAME,
    EVENT_PLAYER_KILLED,
    PROPNAME_TYPE,
    PROPNAME_POSITION,
    PROPNAME_PAYLOAD,
    PROPNAME_ID,
    PROPNAME_RECEIVE_HIT,
    PROPNAME_GUN_SHOT,
    PROPNAME_PICK_UP_ITEM,
    PROPNAME_SWITCH_GUN,
  } = sharedConfig;

  return {
    socket: null,
    id: null,
    clientUpdates: [],
    streamData: {
      angle: 0,
    },
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
    connectToServer(state) {
      return new Promise(onConnection => {
        const socket = io(window.location.href, {
          reconnect: false,
          reconnects: false,
        });

        socket.on(EVENT_SERVER_INIT_NEW_GAME, ({ state: newState, winner }) => {
          if (winner && winner[PROPNAME_ID] === connection.id) {
            audio.playSound(audio.sounds.win, 2);
          }
          renderStaticEnvironment(state.environment);
          syncController.handleInitNewGame(newState, state);
        });

        socket.on(EVENT_SERVER_INIT_CLIENT, id => {
          this.id = id;
          onConnection();
        });

        socket.on(EVENT_SERVER_UPDATE, serverState => {
          syncController.handleReceivedStateFromServer(serverState, state);
        });

        socket.on(EVENT_PLAYER_KILLED, ({ targetId, byId }) => {
          const { opponents } = state;

          const target = opponents.find(
            opponent => opponent[PROPNAME_ID] === targetId
          );
          if (target) {
            drawStaticCellImageAt(
              dom.elements.images.blood,
              target.localPosition
            );
          }
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
    appendGunShot(from, to, activeItemIndex) {
      this.clientUpdates.push({
        [PROPNAME_TYPE]: PROPNAME_GUN_SHOT,
        [PROPNAME_PAYLOAD]: { from, to, activeItemIndex },
      });
    },
    appendItemPickUp(item) {
      this.clientUpdates.push({
        [PROPNAME_TYPE]: PROPNAME_PICK_UP_ITEM,
        [PROPNAME_PAYLOAD]: item,
      });
    },
    appendSwitchGun(activeItemIndex) {
      this.clientUpdates.push({
        [PROPNAME_TYPE]: PROPNAME_SWITCH_GUN,
        [PROPNAME_PAYLOAD]: activeItemIndex,
      });
    },
    updateStreamData({ player }) {
      this.streamData = {
        angle: vectorAngle(subtract(player.aim, player.position)),
      };
    },
    emitUpdates() {
      this.socket.emit(EVENT_CLIENT_UPDATE, {
        events: this.clientUpdates,
        streamData: this.streamData,
      });
      this.clientUpdates = [];
    },
  };
})();
