const canvas = document.querySelector('.game__world');
const shadowCanvas = document.querySelector('.game__shadow');
const ctx = canvas.getContext('2d');
const shadowCtx = shadowCanvas.getContext('2d');

canvas.width = shadowCanvas.width = GAME_SCREEN_WIDTH;
canvas.height = shadowCanvas.height = GAME_SCREEN_HEIGHT;

const cellWidth = canvas.offsetWidth / GRID_CELLS_X;
const cellHeight = canvas.offsetHeight / GRID_CELLS_Y;

const shadowAlphaGrid = fill(GRID_CELLS_X, () => fill(GRID_CELLS_Y, () => 1));

const player = {
  element: document.querySelector('.player'),
  lastMoveTime: 0,
  moveWaitTime: 400,
  speed: 1,
  position: [9, 9],
  sight: 5,
  aim: [0, 0],
  aimSight: 3,
  aiming: false
};

let keysDown = {};
let clicks = [];

function processInput() {
  const { w: up, s: down, a: left, d: right, shift } = keysDown;
  const { speed } = player;
  const newPosition = player.position.map(val => val);
  const playerStartPosition = player.position;
  const now = Date.now();
  const canMove = now - player.lastMoveTime > player.moveWaitTime;

  if (canMove) {
    if (right) newPosition[0] += speed;
    else if (left) newPosition[0] -= speed;
    else if (down) newPosition[1] += speed;
    else if (up) newPosition[1] -= speed;
  }

  player.aiming = shift;

  if (!anyPointAt(newPosition, obstacles)) {
    player.position = newPosition;
  }

  const didMove = !areIdentical(player.position, playerStartPosition);

  if (didMove) {
    playSound(sounds.step);
    moveElementTo(player.element, player.position);
    player.lastMoveTime = now;
  }
}

function tick() {
  processInput();
  drawShadow(shadowAlphaGrid);
  clicks = [];
}

function initGame() {
  player.position = [9, 9];

  moveElementTo(player.element, player.position);
  renderWorld();
  setInterval(tick, FRAME_TIME);
}

function updateCssVariables() {
  document.documentElement.style.setProperty('--cell-width', `${cellWidth}`);
  document.documentElement.style.setProperty('--cell-height', `${cellHeight}`);
}

function boot() {
  updateCssVariables();
  setupEventListeners();
  initGame();
}

boot();
