const CELL_WIDTH = 20;
const CELL_HEIGHT = 20;
const GAME_SCREEN_WIDTH = sharedConfig.GRID_CELLS_X * CELL_WIDTH;
const GAME_SCREEN_HEIGHT = sharedConfig.GRID_CELLS_Y * CELL_HEIGHT;
const FRAME_TIME = 100;
const PLAYER_FIELD_OF_VIEW = 120 * (Math.PI / 180);
const PLAYER_SIGHT = 12;
const PLAYER_MOVE_SLEEP_TIME = 240;
const PLAYER_AIM_FIELD_OF_VIEW = 69 * (Math.PI / 180);
const PLAYER_AIM_SIGHT = 18;
const CAMERA_VIEW_WIDTH = 35;
const CAMERA_VIEW_HEIGHT = 35;
const OPPONENT_MOVE_SLEEP_TIME = PLAYER_MOVE_SLEEP_TIME * 0.95;
const OBJECT_PLAYER_SPAWN_POINT = 'OBJECT_PLAYER_SPAWN_POINT';
const OBJECT_LOOT_SPAWN_POINT = 'OBJECT_LOOT_SPAWN_POINT';
const OBJECT_TREE = 'OBJECT_TREE';
const OBJECT_WALL = 'OBJECT_WALL';
