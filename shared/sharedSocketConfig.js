const sharedSocketConfig = {
  PLAYER_POSITIONS_BUFFER_LENGTH: 5,
  CLIENT_SERVER_UPDATE_INTERVAL: 200,
  GRID_CELLS_X: 80,
  GRID_CELLS_Y: 80,
  ZONE_SHRINK_SLEEP_TIME: 5000,
  ZONE_DIAMETER_SHRINK_AMOUNT: 20,
  ZONE_MIN_DIAMETER: 8,
  ZONE_DAMAGE_SLEEP_TIME: 2000,
  ZONE_DAMAGE: 10,
  PLAYER_SPAWN_POINTS_COUNT: 10,
  PROPNAME_TYPE: 'PROPNAME_TYPE',
  PROPNAME_POSITION: 'PROPNAME_POSITION',
  PROPNAME_PAYLOAD: 'PROPNAME_PAYLOAD',
  PROPNAME_POSITION_BUFFER: 'PROPNAME_POSITION_BUFFER',
  PROPNAME_POSITION_BUFFER_OFFSET: 'PROPNAME_POSITION_BUFFER_OFFSET',
  PROPNAME_ID: 'PROPNAME_ID',
  PROPNAME_RECEIVE_HIT: 'PROPNAME_RECEIVE_HIT',
  EVENT_SERVER_INIT_CLIENT: 'EVENT_SERVER_INIT_CLIENT',
  EVENT_CLIENT_UPDATE: 'EVENT_CLIENT_UPDATE',
  EVENT_SERVER_UPDATE: 'EVENT_SERVER_UPDATE',
  EVENT_SERVER_INIT_NEW_GAME: 'EVENT_SERVER_INIT_NEW_GAME',
};

try {
  module.exports = sharedSocketConfig;
} catch (err) {}
