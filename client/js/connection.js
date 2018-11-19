const connection = (function() {
  const {
    EVENT_SERVER_INIT_CLIENT,
    EVENT_CLIENT_UPDATE,
    EVENT_SERVER_UPDATE,
    EVENT_SERVER_INIT_NEW_GAME,
    EVENT_PLAYER_KILLED,
    EVENT_CLIENT_JOIN,
    PROPNAME_TYPE,
    PROPNAME_POSITION,
    PROPNAME_PAYLOAD,
    PROPNAME_ID,
    PROPNAME_RECEIVE_HIT,
    PROPNAME_GUN_SHOT,
    PROPNAME_PICK_UP_ITEM,
    PROPNAME_SWITCH_GUN,
    PROPNAME_RELOAD_GUN,
  } = sharedConfig;

  return {
    socket: null,
    id: null,
    game: null,
    name: '',
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
    connectToServer(game, name) {
      this.name = name;
      this.game = game;
      return new Promise(onConnection => {
        const socket = io(window.location.href, {
          reconnect: false,
          reconnects: false,
        });

        socket.on(EVENT_SERVER_INIT_CLIENT, id => {
          document
            .querySelector('.connection-status')
            .classList.add('connection-status--online');
          document.querySelector('.connection-status__text').innerHTML =
            'online';

          this.id = id;

          socket.emit(EVENT_CLIENT_JOIN, name, () => {
            onConnection();

            socket.on(
              EVENT_SERVER_INIT_NEW_GAME,
              ({ state: newState, winner, mapData }) => {
                if (winner) {
                  dom.appendGameLogMessage(`<b>${winner.name}</b> won!`);
                  if (winner[PROPNAME_ID] === connection.id) {
                    audio.playSound(audio.sounds.win, 2);
                  }
                }
                game.restart(mapData, newState);
                syncController.handleInitNewGame(newState, this.game.state);
                dom.showView(dom.elements.views.game);
                dom.appendGameLogMessage(`New game started.`);
              }
            );

            socket.on(EVENT_SERVER_UPDATE, serverState => {
              if (!this.game.active) return;
              syncController.handleReceivedStateFromServer(
                serverState,
                this.game.state
              );
            });

            socket.on(EVENT_PLAYER_KILLED, ({ targetId, byId }) => {
              const { opponents } = this.game.state;

              const target = opponents.find(
                opponent => opponent[PROPNAME_ID] === targetId
              );
              const fragger = opponents.find(
                opponent => opponent[PROPNAME_ID] === byId
              );
              if (target) {
                drawStaticCellImageAt(
                  dom.elements.images.blood,
                  target.localPosition
                );
              }
              if (fragger && target) {
                dom.appendGameLogMessage(
                  `<b>${fragger.name}</b> fragged <b>${target.name}</b>`
                );
              }
            });
          });

          socket.on('disconnect', () => {
            console.log('Disconnected.');
            document
              .querySelector('.connection-status')
              .classList.remove('connection-status--online');
            document.querySelector('.connection-status__text').innerHTML =
              'offline';
          });
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
    appendGunReload() {
      this.clientUpdates.push({
        [PROPNAME_TYPE]: PROPNAME_RELOAD_GUN,
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
