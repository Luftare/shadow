const {
  PLAYER_POSITIONS_BUFFER_LENGTH,
  PROPNAME_POSITION_BUFFER,
  PROPNAME_POSITION_BUFFER_OFFSET,
  PROPNAME_TYPE,
  PROPNAME_POSITION,
  PROPNAME_PAYLOAD,
  PROPNAME_ID,
} = require('../shared/sharedSocketConfig');

const state = {
  players: [],
};

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

function getState() {
  return state;
}

module.exports = {
  state,
  addPlayer,
  removePlayer,
  getState,
  handleClientUpdates,
};
