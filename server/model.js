const {
  PLAYER_POSITIONS_BUFFER_LENGTH,
  PROPNAME_POSITION_BUFFER,
  PROPNAME_TYPE,
  PROPNAME_POSITION,
  PROPNAME_PAYLOAD,
} = require('../shared/sharedSocketConfig');

const state = {
  players: [],
};

function handleClientUpdates(id, updates) {
  const player = state.players.find(player => player.id === id);

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
          player.firstPositionIndex++;
        }
        break;

      default:
        break;
    }
  });
}

function addPlayer(id) {
  state.players.push({
    id,
    [PROPNAME_POSITION_BUFFER]: [],
    firstPositionIndex: 0,
  });
}

function removePlayer(id) {
  state.players = state.players.filter(player => player.id !== id);
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
