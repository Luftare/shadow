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
  GRID_CELLS_X,
  GRID_CELLS_Y,
} = require('../shared/sharedSocketConfig');

const { shuffle } = require('./utils');

const { updateZone, pointInsideZone } = require('./zone');

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
  if (players.length > 1) {
    const onePlayerAlive = players.filter(player => player.hp > 0).length <= 1;

    if (onePlayerAlive) {
      resetState(players);
      handleNewGame(state);
    }
  }
}

function handleZoneDamage(state) {
  // console.log(state.players[0]);
  state.players.forEach(player => {
    const position =
      player[PROPNAME_POSITION_BUFFER][
        player[PROPNAME_POSITION_BUFFER].length - 1
      ];
    if (!pointInsideZone(position, state.zone)) {
      player.hp = Math.max(0, player.hp - 1);
    }
  });
}

function updateModel() {
  updateZone(state);
  handleZoneDamage(state);
  requestNewGame(state);
}

function handleClientUpdates(id, updates) {
  const player = state.players.find(player => player[PROPNAME_ID] === id);

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
  initModel,
};
