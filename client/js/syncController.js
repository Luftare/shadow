const syncController = {
  updateOpponents({ opponents, player }) {
    const {
      PROPNAME_POSITION_BUFFER_OFFSET,
      PROPNAME_POSITION_BUFFER,
    } = sharedConfig;
    const now = Date.now();

    opponents.forEach(opponent => {
      if (opponent.hp <= 0) {
        opponent.element.classList.add('game__opponent--dead');
        return;
      }
      const timeSinceLastMove = now - opponent.lastMovementTime;
      const enoughtTimeSinceLastMove =
        timeSinceLastMove >= OPPONENT_MOVE_SLEEP_TIME;

      if (enoughtTimeSinceLastMove) {
        const maxPositionBufferIndex =
          opponent[PROPNAME_POSITION_BUFFER_OFFSET] +
          opponent[PROPNAME_POSITION_BUFFER].length -
          1;
        const positionsInBuffer =
          maxPositionBufferIndex > opponent.localPositionBufferIndex;

        if (positionsInBuffer) {
          opponent.localPositionBufferIndex = Math.max(
            opponent.localPositionBufferIndex + 1,
            opponent[PROPNAME_POSITION_BUFFER_OFFSET]
          );
          const offset =
            maxPositionBufferIndex - opponent.localPositionBufferIndex;
          const bufferIndex =
            opponent[PROPNAME_POSITION_BUFFER].length - 1 - offset;
          opponent.localPosition =
            opponent[PROPNAME_POSITION_BUFFER][bufferIndex];
          opponent.lastMovementTime = now;

          const volume = audio.getPointsAudioVolume(
            opponent.localPosition,
            player.position
          );
          audio.playSound(audio.sounds.step, volume);
        }
      }
    });

    opponents.forEach(({ element, localPosition }) =>
      dom.moveElementTo(element, localPosition)
    );
  },
  applyNewStateToOpponent(serverOpponent, state) {
    const { opponents: localOpponents, player: localPlayer } = state;
    const {
      PROPNAME_POSITION_BUFFER_OFFSET,
      PROPNAME_POSITION_BUFFER,
      PROPNAME_ID,
    } = sharedConfig;

    const localOpponent = localOpponents.find(
      localOpponent =>
        localOpponent[PROPNAME_ID] === serverOpponent[PROPNAME_ID]
    );

    localOpponent.items = serverOpponent.items.map(item => {
      const localItem = localOpponent.items.find(
        localItem => localItem.id === item.id
      );
      if (localItem) {
        item.localState = localItem.localState;
      }
      return item;
    });
    localOpponent[PROPNAME_POSITION_BUFFER] =
      serverOpponent[PROPNAME_POSITION_BUFFER];
    localOpponent[PROPNAME_POSITION_BUFFER_OFFSET] =
      serverOpponent[PROPNAME_POSITION_BUFFER_OFFSET];
    localOpponent.hp = serverOpponent.hp;
    localOpponent.activeItemIndex = serverOpponent.activeItemIndex;
    localOpponent.angle = serverOpponent.angle;

    localOpponent.element.src = dom.getPlayerImage(localOpponent);
    updatePlayerTransform(localOpponent.element, localOpponent.angle);

    const gun = getActiveGun(serverOpponent);
    const shootingAutoFire =
      gun &&
      gun.autoFire &&
      gun.state.magazine > 0 &&
      serverOpponent.pullingTrigger &&
      !serverOpponent.reloading;

    if (shootingAutoFire) {
      if (!gun.localState.sound) {
        gun.localState.sound = audio.playSound(audio.sounds[gun.name + 'Shot']);
      }
    }

    const shouldStopAutoFire =
      gun &&
      gun.localState.sound &&
      (!serverOpponent.pullingTrigger || gun.state.magazine <= 0);

    if (shouldStopAutoFire) {
      gun.localState.sound.pause();
      delete gun.localState.sound;
    }

    serverOpponent.shots.forEach(({ from, to }) => {
      if (gun) {
        const volume = audio.getPointsAudioVolume(from, localPlayer.position);
        if (!gun.autoFire) {
          audio.playSound(audio.sounds[`${gun.name}Shot`], volume);
        }
        dom.indicateShotAtDirection(from, state);
        flashImageAt(images.explosion, to);
      }
    });

    if (serverOpponent.shots.length > 0 && localOpponent) {
      localOpponent.element.classList.add('shooting');

      setTimeout(() => {
        localOpponent.element.classList.remove('shooting');
      }, 50);
    }

    updatePlayerTransform(localOpponent.element, localOpponent.angle);
  },
  addNewOpponent(opponent, state) {
    const {
      PROPNAME_POSITION_BUFFER_OFFSET,
      PROPNAME_POSITION_BUFFER,
    } = sharedConfig;

    const localPositionBufferIndex = opponent[PROPNAME_POSITION_BUFFER_OFFSET];
    const localPosition = opponent[PROPNAME_POSITION_BUFFER][0];

    const element = dom.createOpponentElement();
    dom.moveElementTo(element, localPosition);
    const localOpponent = {
      ...opponent,
      localPositionBufferIndex,
      localPosition,
      lastMovementTime: 0,
      element,
      localPosition,
    };

    element.addEventListener('mousedown', () => {
      connection.appendPullTrigger();
      input.state.mouseDown = true;
      handleClickAt(localOpponent.localPosition);
    });

    state.opponents.push(localOpponent);
  },
  removeOpponent(opponent, state) {
    const { PROPNAME_ID } = sharedConfig;
    state.opponents = state.opponents.filter(
      localOpponent => localOpponent[PROPNAME_ID] !== opponent[PROPNAME_ID]
    );
    dom.removeOpponentElement(opponent.element);
  },
  handleLocalPlayerModel(serverState, localState) {
    const { PROPNAME_ID } = sharedConfig;
    const serverStatePlayer = serverState.players.find(
      player => player[PROPNAME_ID] === connection.id
    );
    if (!serverStatePlayer) return;
    const receivedDamage = localState.player.hp > serverStatePlayer.hp;
    localState.player.hp = serverStatePlayer.hp;
    localState.player.items = serverStatePlayer.items.map(item => {
      const localItem = localState.player.items.find(
        localItem => localItem.id === item.id
      );
      if (localItem) {
        item.localState = localItem.localState;
      }
      return item;
    });
    if (receivedDamage) {
      flashRedScreen();
      audio.playSound(audio.sounds.ouch);
      if (serverStatePlayer.hp <= 0) {
        audio.playSound(audio.sounds.lose, 2);
        const rank =
          serverState.player.filter(player => player.hp > 0).length + 1;
        dom.appendGameLogMessage(`Died... you were <b>#${rank}</b>`);
      }
    }
  },
  handlePlayerModelUpdate(serverState, localState) {
    const { PROPNAME_ID } = sharedConfig;
    const serverOpponents = serverState.players.filter(
      player => player[PROPNAME_ID] !== connection.id
    );

    const newOpponents = serverOpponents.filter(
      serverOpponent =>
        !localState.opponents.find(
          localOpponent =>
            localOpponent[PROPNAME_ID] === serverOpponent[PROPNAME_ID]
        )
    );

    const disconnectedOpponents = localState.opponents.filter(
      localOpponent =>
        !serverOpponents.find(
          serverOpponent =>
            serverOpponent[PROPNAME_ID] === localOpponent[PROPNAME_ID]
        )
    );

    newOpponents.forEach(opponent => {
      syncController.addNewOpponent(opponent, localState);
    });

    disconnectedOpponents.forEach(opponent => {
      syncController.removeOpponent(opponent, localState);
    });

    serverOpponents.forEach(opponent =>
      syncController.applyNewStateToOpponent(opponent, localState)
    );
  },
  handleZoneUpdate(serverState, localState) {
    localState.zone = serverState.zone;
    localState.nextZone = serverState.nextZone;
  },
  handleReceivedStateFromServer(serverState, localState) {
    syncController.handleLocalPlayerModel(serverState, localState);
    syncController.handlePlayerModelUpdate(serverState, localState);
    syncController.handleZoneUpdate(serverState, localState);
    localState.timeToNextZoneShrink = serverState.timeToNextZoneShrink;
    localState.items = serverState.items;
  },
  handleInitNewGame(serverState, localState) {
    const { PROPNAME_ID, PROPNAME_POSITION_BUFFER } = sharedConfig;
    const { player } = localState;
    const serverPlayerData = serverState.players.find(
      player => player[PROPNAME_ID] === connection.id
    );
    if (!serverPlayerData) return;

    player.position = serverPlayerData.spawnPoint;
    connection.appendNewPosition(player.position);
    dom.moveElementTo(dom.elements.player, player.position);

    localState.opponents.forEach(opponent => {
      this.removeOpponent(opponent, localState);
    });

    localState.opponents = [];

    serverState.players.forEach(player => {
      if (player[PROPNAME_ID] !== connection.id) {
        syncController.addNewOpponent(player, localState);
      }
    });

    localState.items = serverState.items;
  },
};
