const {
  PLAYER_POSITIONS_BUFFER_LENGTH,
  STATE_PROPS_POSITIONS,
  CLIENT_UPDATE_TYPE,
  CLIENT_UPDATE_POSITION,
  SOCKET_PAYLOAD,
} = require('../shared/sharedSocketConfig');

const state = {
  players: [],
};

function handleClientUpdates(id, updates) {
  const player = state.players.find(player => player.id === id);

  updates.forEach(update => {
    const updateType = update[CLIENT_UPDATE_TYPE];

    switch (updateType) {
      case CLIENT_UPDATE_POSITION:
        player[STATE_PROPS_POSITIONS].push(update[SOCKET_PAYLOAD]);
        const bufferIsFull =
          player[STATE_PROPS_POSITIONS].length > PLAYER_POSITIONS_BUFFER_LENGTH;
        if (bufferIsFull) {
          player[STATE_PROPS_POSITIONS].shift();
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
    [STATE_PROPS_POSITIONS]: [],
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
