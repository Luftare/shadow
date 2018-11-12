const {
  PLAYER_POSITIONS_BUFFER_LENGTH,
  PLAYER_SPAWN_POINTS_COUNT,
  PROPNAME_POSITION_BUFFER,
  PROPNAME_POSITION_BUFFER_OFFSET,
  PROPNAME_TYPE,
  PROPNAME_POSITION,
  PROPNAME_PAYLOAD,
  PROPNAME_ID,
  PROPNAME_RECEIVE_HIT,
  PROPNAME_GUN_SHOT,
  GRID_CELLS_X,
  GRID_CELLS_Y,
  ZONE_DAMAGE,
  NEW_GAME_DELAY_TIME,
} = require('../shared/sharedSocketConfig');

const { shuffle } = require('./utils');

const { updateZone, pointInsideZone, requestZoneDamage } = require('./zone');

let newGameOnTimeout = false;

let state = getInitState();
let handleNewGame;

function initModel(handleNewGameCallback) {
  handleNewGame = handleNewGameCallback;
}

function getInitState(players = []) {
  const orderedIndexes = [...Array(PLAYER_SPAWN_POINTS_COUNT)].map((_, i) => i);
  const spawnPointIndexes = shuffle(orderedIndexes);
  const updatedPlayers = players.map((player, i) => {
    return {
      ...player,
      hp: 100,
      [PROPNAME_POSITION_BUFFER]: [[0, 0]],
      [PROPNAME_POSITION_BUFFER_OFFSET]: 0,
      spawnPointIndex: spawnPointIndexes[i],
      shots: [],
    };
  });

  return {
    players: updatedPlayers,
    zone: [0, 0, GRID_CELLS_X, GRID_CELLS_Y],
    nextZone: [0, 0, GRID_CELLS_X, GRID_CELLS_Y],
    lastZoneShrinkTime: Date.now(),
    timeToNextZoneShrink: 0,
  };
}

function requestNewGame({ players }) {
  if (players.length > 1 && !newGameOnTimeout) {
    const onePlayerAlive = players.filter(player => player.hp > 0).length <= 1;

    if (onePlayerAlive) {
      newGameOnTimeout = true;
      setTimeout(() => {
        newGameOnTimeout = false;
        resetState(players);
        handleNewGame(state);
      }, NEW_GAME_DELAY_TIME);
    }
  }
}

function handleZoneDamage(state) {
  if (!requestZoneDamage()) return;
  state.players.forEach(player => {
    const position =
      player[PROPNAME_POSITION_BUFFER][
        player[PROPNAME_POSITION_BUFFER].length - 1
      ];
    if (!pointInsideZone(position, state.zone)) {
      player.hp = Math.max(0, player.hp - ZONE_DAMAGE);
    }
  });
}

function updateModel() {
  updateZone(state);
  handleZoneDamage(state);
  requestNewGame(state);
}

function updateModelAfterBroadcast() {
  state.players.forEach(player => {
    player.shots = [];
  });
}

function handleClientUpdates(id, updates) {
  const player = state.players.find(player => player[PROPNAME_ID] === id);
  if (!player) return;
  updates.forEach(update => {
    const updateType = update[PROPNAME_TYPE];

    switch (updateType) {
      case PROPNAME_POSITION:
        player[PROPNAME_POSITION_BUFFER].push(update[PROPNAME_PAYLOAD]);
        const bufferIsFull =
          player[PROPNAME_POSITION_BUFFER].length >
          PLAYER_POSITIONS_BUFFER_LENGTH;
        if (bufferIsFull) {
          player[PROPNAME_POSITION_BUFFER].shift();
          player[PROPNAME_POSITION_BUFFER_OFFSET]++;
        }
        break;
      case PROPNAME_RECEIVE_HIT:
        const targetId = update[PROPNAME_PAYLOAD];
        const target = state.players.find(
          player => player[PROPNAME_ID] === targetId
        );
        if (target) {
          target.hp = Math.max(0, target.hp - 20);
        }
        break;
      case PROPNAME_GUN_SHOT:
        player.shots.push(update[PROPNAME_PAYLOAD]);
        break;

      default:
        break;
    }
  });
}

function addPlayer(id) {
  const position = [9, 9];

  const player = {
    [PROPNAME_ID]: id,
    [PROPNAME_POSITION_BUFFER]: [position],
    [PROPNAME_POSITION_BUFFER_OFFSET]: 0,
    hp: 100,
    spawnPointIndex: 0,
    shots: [],
  };

  state.players.push(player);

  return position;
}

function removePlayer(id) {
  state.players = state.players.filter(player => player[PROPNAME_ID] !== id);
}

function resetState(players) {
  state = getInitState(players);
}

function getState() {
  return state;
}

module.exports = {
  state,
  addPlayer,
  removePlayer,
  getState,
  resetState,
  handleClientUpdates,
  updateModel,
  updateModelAfterBroadcast,
  initModel,
};
