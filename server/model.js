const {
  PLAYER_POSITIONS_BUFFER_LENGTH,
  PLAYER_SPAWN_POINTS_COUNT,
  ITEM_SPAWN_POINTS_COUNT,
  PROPNAME_POSITION_BUFFER,
  PROPNAME_POSITION_BUFFER_OFFSET,
  PROPNAME_TYPE,
  PROPNAME_POSITION,
  PROPNAME_PAYLOAD,
  PROPNAME_ID,
  PROPNAME_RECEIVE_HIT,
  PROPNAME_GUN_SHOT,
  PROPNAME_PICK_UP_ITEM,
  GRID_CELLS_X,
  GRID_CELLS_Y,
  ZONE_DAMAGE,
  NEW_GAME_DELAY_TIME,
  IDLE_KICK_TIME,
} = require('../shared/sharedConfig');

const { getMapData } = require('./mapParser');

const allItems = require('../shared/items');

const { shuffle } = require('./utils');

const { updateZone, pointInsideZone, requestZoneDamage } = require('./zone');

let newGameOnTimeout = false;

let state;
let handleNewGame;
let mapData;

function initModel(handleNewGameCallback) {
  handleNewGame = handleNewGameCallback;

  return new Promise(res => {
    getMapData().then(receivedMapData => {
      mapData = receivedMapData;
      state = getInitState();
      res();
    });
  });
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
      spawnPointIndex: spawnPointIndexes[i % PLAYER_SPAWN_POINTS_COUNT],
      shots: [],
      items: [],
    };
  });

  return {
    players: updatedPlayers,
    zone: [0, 0, GRID_CELLS_X, GRID_CELLS_Y],
    nextZone: [0, 0, GRID_CELLS_X, GRID_CELLS_Y],
    lastZoneShrinkTime: Date.now(),
    timeToNextZoneShrink: 0,
    items: generateItems(),
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

function generateItems() {
  return mapData.itemSpawnPoints.map(spawnPoint => {
    if (Math.random() > 0) {
      const itemIndex = Math.floor(allItems.length * Math.random());
      return [...spawnPoint, allItems[itemIndex]];
    } else {
      return null;
    }
  });
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
  if (updates.length) player.lastActivityTime = Date.now();
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
        const gun = player.items[player.items.length - 1];
        if (gun) {
          const damage = gun[2] === 'sniper' ? 40 : 20;
          const targetId = update[PROPNAME_PAYLOAD];
          const target = state.players.find(
            player => player[PROPNAME_ID] === targetId
          );
          if (target) {
            target.hp = Math.max(0, target.hp - damage);
          }
        }
        break;
      case PROPNAME_GUN_SHOT:
        player.shots.push(update[PROPNAME_PAYLOAD]);
        break;
      case PROPNAME_PICK_UP_ITEM:
        const pickedItem = update[PROPNAME_PAYLOAD];
        player.items.push(update[PROPNAME_PAYLOAD]);
        state.items = state.items.filter(
          item => item[0] !== pickedItem[0] && item[1] && pickedItem[1]
        );
        break;

      default:
        break;
    }
  });
}

function addPlayer(id) {
  const position = [9, 9];
  const existingPlayer = state.players.find(
    player => player[PROPNAME_ID] === id
  );
  if (existingPlayer) return existingPlayer;

  const player = {
    [PROPNAME_ID]: id,
    [PROPNAME_POSITION_BUFFER]: [position],
    [PROPNAME_POSITION_BUFFER_OFFSET]: 0,
    hp: 0,
    spawnPointIndex: 0,
    lastActivityTime: Date.now(),
    shots: [],
    items: [],
  };

  state.players.push(player);

  return position;
}

function getIdlePlayers() {
  const now = Date.now();
  const idlers = state.players.filter(
    player => now - player.lastActivityTime >= IDLE_KICK_TIME
  );
  state.players = state.players.filter(
    player => now - player.lastActivityTime < IDLE_KICK_TIME
  );
  return idlers;
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
  getIdlePlayers,
};
