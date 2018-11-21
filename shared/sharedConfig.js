const sharedConfig = {
  IDLE_KICK_TIME: 5 * 60 * 1000,
  PLAYER_POSITIONS_BUFFER_LENGTH: 5,
  CLIENT_SERVER_UPDATE_INTERVAL: 200,
  GRID_CELLS_X: 80,
  GRID_CELLS_Y: 80,
  ZONE_SHRINK_SLEEP_TIME: 35000,
  ZONE_DIAMETER_SHRINK_AMOUNT: 20,
  ZONE_MIN_DIAMETER: 0,
  ZONE_DAMAGE_SLEEP_TIME: 1000,
  ZONE_DAMAGE: 5,
  PLAYER_SPAWN_POINTS_COUNT: 10,
  ITEM_SPAWN_POINTS_COUNT: 16,
  PROPNAME_TYPE: 'PROPNAME_TYPE',
  PROPNAME_POSITION: 'PROPNAME_POSITION',
  PROPNAME_PAYLOAD: 'PROPNAME_PAYLOAD',
  PROPNAME_POSITION_BUFFER: 'PROPNAME_POSITION_BUFFER',
  PROPNAME_POSITION_BUFFER_OFFSET: 'PROPNAME_POSITION_BUFFER_OFFSET',
  PROPNAME_ID: 'PROPNAME_ID',
  PROPNAME_RECEIVE_HIT: 'PROPNAME_RECEIVE_HIT',
  PROPNAME_GUN_SHOT: 'PROPNAME_GUN_SHOT',
  PROPNAME_PICK_UP_ITEM: 'PROPNAME_PICK_UP_ITEM',
  PROPNAME_SWITCH_GUN: 'PROPNAME_SWITCH_GUN',
  PROPNAME_PLAYER_RELOAD: 'PROPNAME_PLAYER_RELOAD',
  PROPNAME_PULL_TRIGGER: 'PROPNAME_PULL_TRIGGER',
  PROPNAME_RELEASE_TRIGGER: 'PROPNAME_RELEASE_TRIGGER',
  PROPNAME_DROP_ITEM: 'PROPNAME_DROP_ITEM',
  EVENT_SERVER_INIT_CLIENT: 'EVENT_SERVER_INIT_CLIENT',
  EVENT_CLIENT_UPDATE: 'EVENT_CLIENT_UPDATE',
  EVENT_SERVER_UPDATE: 'EVENT_SERVER_UPDATE',
  EVENT_SERVER_INIT_NEW_GAME: 'EVENT_SERVER_INIT_NEW_GAME',
  EVENT_PLAYER_KILLED: 'EVENT_PLAYER_KILLED',
  EVENT_CLIENT_JOIN: 'EVENT_CLIENT_JOIN',
  NEW_GAME_DELAY_TIME: 2000,
};

try {
  module.exports = sharedConfig;
} catch (err) {}
