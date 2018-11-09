const {
  PLAYER_POSITIONS_BUFFER_LENGTH,
  PROPNAME_POSITION_BUFFER,
  PROPNAME_POSITION_BUFFER_OFFSET,
  PROPNAME_TYPE,
  PROPNAME_POSITION,
  PROPNAME_PAYLOAD,
  PROPNAME_ID,
  GRID_CELLS_X,
  GRID_CELLS_Y,
} = require('../shared/sharedSocketConfig');

const { requestZoneShrink } = require('./zone');

let state = getInitState();

function getInitState(players = []) {
  return {
    players,
    zone: [0, 0, GRID_CELLS_X, GRID_CELLS_Y],
    nextZone: [0, 0, GRID_CELLS_X, GRID_CELLS_Y],
    lastZoneShrinkTime: Date.now(),
  };
}

function updateModel() {
  requestZoneShrink(state);
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
  };

  state.players.push(player);

  return position;
}

function removePlayer(id) {
  state.players = state.players.filter(player => player[PROPNAME_ID] !== id);
}

function resetState() {
  state = getInitState(state.players);
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
};
