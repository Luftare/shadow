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
  PROPNAME_PICK_UP_ITEM,
  PROPNAME_SWITCH_GUN,
  PROPNAME_RELOAD_GUN,
  PROPNAME_PULL_TRIGGER,
  PROPNAME_RELEASE_TRIGGER,
  GRID_CELLS_X,
  GRID_CELLS_Y,
  ZONE_DAMAGE,
  IDLE_KICK_TIME,
  EVENT_PLAYER_KILLED,
} = require('../shared/sharedConfig');

const { getMapData } = require('./mapParser');

const { itemsArray } = require('../shared/items');

const { shuffle } = require('./utils');

const { updateZone, pointInsideZone, requestZoneDamage } = require('./zone');

let state;
let handleNewGame;
let mapData;
let broadcastEvent;
let idCounter = 1;

function initModel(handleNewGameCallback, handleBroadcastEvent) {
  broadcastEvent = handleBroadcastEvent;
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
    const spawnPointIndex = spawnPointIndexes[i % PLAYER_SPAWN_POINTS_COUNT];
    const spawnPoint = mapData.playerSpawnPoints[spawnPointIndex];
    // const spawnPoint = mapData.playerSpawnPoints[0];
    return {
      ...player,
      hp: 100,
      [PROPNAME_POSITION_BUFFER]: [spawnPoint],
      [PROPNAME_POSITION_BUFFER_OFFSET]: 0,
      spawnPoint,
      shots: [],
      items: [],
      activeItemIndex: 0,
      angle: 0,
      pullingTrigger: false,
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
  if (players.length > 1) {
    const onePlayerAlive = players.filter(player => player.hp > 0).length <= 1;

    if (onePlayerAlive) {
      const winner = players.find(player => player.hp > 0);

      resetState(players);
      handleNewGame(state, winner, mapData);
    }
  }
}

function generateItems() {
  return mapData.itemSpawnPoints
    .map(spawnPoint => {
      if (Math.random() > 0) {
        const itemIndex = Math.floor(itemsArray.length * Math.random());
        const itemModel = itemsArray[itemIndex];
        const item = {
          ...itemModel,
          state: { ...itemModel.state },
          position: spawnPoint,
          id: idCounter++,
        };
        return item;
      } else {
        return null;
      }
    })
    .filter(item => !!item);
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

function handleClientUpdate(id, { events, streamData }) {
  const player = state.players.find(player => player[PROPNAME_ID] === id);
  if (!player || !events) return;
  if (events.length) player.lastActivityTime = Date.now();

  player.angle = streamData.angle;

  const gun = player.items[player.activeItemIndex];
  events.forEach(event => {
    const eventType = event[PROPNAME_TYPE];

    switch (eventType) {
      case PROPNAME_POSITION:
        player[PROPNAME_POSITION_BUFFER].push(event[PROPNAME_PAYLOAD]);
        const bufferIsFull =
          player[PROPNAME_POSITION_BUFFER].length >
          PLAYER_POSITIONS_BUFFER_LENGTH;
        if (bufferIsFull) {
          player[PROPNAME_POSITION_BUFFER].shift();
          player[PROPNAME_POSITION_BUFFER_OFFSET]++;
        }
        break;
      case PROPNAME_RECEIVE_HIT:
        if (gun) {
          const damage = gun.damage;
          const targetId = event[PROPNAME_PAYLOAD];
          const target = state.players.find(
            player => player[PROPNAME_ID] === targetId
          );
          if (target && target.hp > 0) {
            target.hp = Math.max(0, target.hp - damage);
            if (target.hp <= 0) {
              broadcastEvent(EVENT_PLAYER_KILLED, {
                targetId: target[PROPNAME_ID],
                byId: id,
              });
            }
          }
        }
        break;
      case PROPNAME_SWITCH_GUN:
        player.activeItemIndex = event[PROPNAME_PAYLOAD];
        break;
      case PROPNAME_RELOAD_GUN:
        if (gun) {
          const magazineRemainder = gun.state.magazine;
          const newMagazineSize = Math.min(gun.magazineSize, gun.state.bullets);
          gun.state.bullets -= newMagazineSize;
          gun.state.bullets += magazineRemainder;
          gun.state.magazine = newMagazineSize;
          player.reloading = true;
          setTimeout(() => {
            player.reloading = false;
          }, gun.reloadTime);
        }
        break;
      case PROPNAME_GUN_SHOT:
        const activeGun = player.items[event[PROPNAME_PAYLOAD].activeItemIndex];
        const canShoot = activeGun && activeGun.state.magazine > 0;
        if (canShoot) {
          player.shots.push(event[PROPNAME_PAYLOAD]);
          activeGun.state.magazine = Math.max(0, activeGun.state.magazine - 1);
        }
        player.activeItemIndex = event[PROPNAME_PAYLOAD].activeItemIndex;
        break;
      case PROPNAME_PULL_TRIGGER:
        player.pullingTrigger = true;
        break;
      case PROPNAME_RELEASE_TRIGGER:
        player.pullingTrigger = false;
        break;
      case PROPNAME_PICK_UP_ITEM:
        const pickedItem = event[PROPNAME_PAYLOAD];
        const existingInstance = player.items.find(
          item => item.name === pickedItem.name
        );
        if (existingInstance) {
          existingInstance.state.bullets += pickedItem.state.bullets;
        } else {
          player.items.push(event[PROPNAME_PAYLOAD]);
        }
        state.items = state.items.filter(
          item =>
            item.position[0] !== pickedItem.position[0] &&
            item.position[1] !== pickedItem.position[1]
        );
        break;

      default:
        break;
    }
  });
}

function addPlayer(id, name) {
  const position = [9, 9];

  const player = {
    [PROPNAME_ID]: id,
    [PROPNAME_POSITION_BUFFER]: [position],
    [PROPNAME_POSITION_BUFFER_OFFSET]: 0,
    hp: 0,
    spawnPointIndex: 0,
    lastActivityTime: Date.now(),
    pullingTrigger: false,
    shots: [],
    items: [],
    angle: 0,
    name,
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
  handleClientUpdate,
  updateModel,
  updateModelAfterBroadcast,
  initModel,
  getIdlePlayers,
};
