const syncController = {
  updateOpponents(opponents) {
    const {
      PROPNAME_POSITION_BUFFER_OFFSET,
      PROPNAME_POSITION_BUFFER,
    } = sharedSocketConfig;
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
        }
      }
    });

    opponents.forEach(({ element, localPosition }) =>
      dom.moveElementTo(element, localPosition)
    );
  },
  applyNewStateToOpponent(
    serverOpponent,
    { opponents: localOpponents, player: localPlayer }
  ) {
    const {
      PROPNAME_POSITION_BUFFER_OFFSET,
      PROPNAME_POSITION_BUFFER,
      PROPNAME_ID,
    } = sharedSocketConfig;

    const localOpponent = localOpponents.find(
      localOpponent =>
        localOpponent[PROPNAME_ID] === serverOpponent[PROPNAME_ID]
    );

    localOpponent[PROPNAME_POSITION_BUFFER] =
      serverOpponent[PROPNAME_POSITION_BUFFER];
    localOpponent[PROPNAME_POSITION_BUFFER_OFFSET] =
      serverOpponent[PROPNAME_POSITION_BUFFER_OFFSET];
    localOpponent.hp = serverOpponent.hp;

    serverOpponent.shots.forEach(position => {
      // const distance =
      audio.playSound(audio.sounds.shot);
    });
  },
  addNewOpponent(opponent, state) {
    const {
      PROPNAME_POSITION_BUFFER_OFFSET,
      PROPNAME_POSITION_BUFFER,
    } = sharedSocketConfig;

    const localPositionBufferIndex = opponent[PROPNAME_POSITION_BUFFER_OFFSET];
    const localPosition = opponent[PROPNAME_POSITION_BUFFER][0];

    const element = dom.createOpponentElement();
    dom.moveElementTo(element, localPosition);
    state.opponents.push({
      ...opponent,
      localPositionBufferIndex,
      lastMovementTime: 0,
      element,
      localPosition,
    });
  },
  removeOpponent(opponent, state) {
    const { PROPNAME_ID } = sharedSocketConfig;
    state.opponents = state.opponents.filter(
      localOpponent => localOpponent[PROPNAME_ID] !== opponent[PROPNAME_ID]
    );
    dom.removeOpponentElement(opponent.element);
  },
  handleLocalPlayerModel(serverState, localState) {
    const { PROPNAME_ID } = sharedSocketConfig;
    const serverStatePlayer = serverState.players.find(
      player => player[PROPNAME_ID] === connection.id
    );
    const receivedDamage = localState.player.hp > serverStatePlayer.hp;
    localState.player.hp = serverStatePlayer.hp;
    if (receivedDamage) flashRedScreen();
  },
  handlePlayerModelUpdate(serverState, localState) {
    const { PROPNAME_ID } = sharedSocketConfig;
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
  },
  handleInitNewGame(data, localState) {
    const { PROPNAME_ID, PROPNAME_POSITION_BUFFER } = sharedSocketConfig;
    const { player } = localState;
    const serverPlayerData = data.players.find(
      player => player[PROPNAME_ID] === connection.id
    );
    const mySpawnPointIndex = serverPlayerData.spawnPointIndex;
    const debugIndex = 5;
    const spawnPoint =
      localState.world[OBJECT_PLAYER_SPAWN_POINT][mySpawnPointIndex];
    // localState.world[OBJECT_PLAYER_SPAWN_POINT][debugIndex];

    player.position = [...spawnPoint];
    connection.appendNewPosition(player.position);
    dom.moveElementTo(dom.elements.player, player.position);

    localState.opponents.forEach(opponent => {
      this.removeOpponent(opponent, localState);
    });
    localState.opponents = [];

    data.players.forEach(player => {
      if (player[PROPNAME_ID] !== connection.id) {
        const spawnPoint =
          localState.world[OBJECT_PLAYER_SPAWN_POINT][player.spawnPointIndex];
        // localState.world[OBJECT_PLAYER_SPAWN_POINT][debugIndex];
        player[PROPNAME_POSITION_BUFFER][0] = [...spawnPoint];
        syncController.addNewOpponent(player, localState);
      }
    });
  },
};
