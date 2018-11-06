const canvas = document.querySelector('.game__world');
const shadowCanvas = document.querySelector('.game__shadow');
const ctx = canvas.getContext('2d');
const shadowCtx = shadowCanvas.getContext('2d');
const fxContainer = document.querySelector('.game__fx');

canvas.width = shadowCanvas.width = GAME_SCREEN_WIDTH;
canvas.height = shadowCanvas.height = GAME_SCREEN_HEIGHT;

const cellWidth = canvas.offsetWidth / GRID_CELLS_X;
const cellHeight = canvas.offsetHeight / GRID_CELLS_Y;

const shadowAlphaGrid = fill(GRID_CELLS_X, () => fill(GRID_CELLS_Y, () => 1));

const player = {
  element: document.querySelector('.game__player'),
  lastMoveTime: 0,
  position: [9, 9],
  aim: [-10, -10],
  aiming: false,
};

let keysDown = {};
let clicks = [];

function processInput() {
  const { w: up, s: down, a: left, d: right, shift } = keysDown;
  const playerStartPosition = player.position;
  const now = Date.now();
  const canMove = now - player.lastMoveTime > PLAYER_MOVE_SLEEP_TIME;
  const stepDirection = [0, 0];

  if (canMove) {
    if (right) stepDirection[0] = 1;
    else if (left) stepDirection[0] = -1;
    else if (down) stepDirection[1] = 1;
    else if (up) stepDirection[1] = -1;
  }

  const toAim = normalise(subtract(player.aim, player.position));
  const aimAxis = toAxis(toAim);
  const aimRadians = Math.PI - aimAxis * 0.5 * Math.PI;
  const rotatedStepDirection = roundVector(rotate(stepDirection, aimRadians));

  player.aiming = shift;

  const newPosition = sum(player.position, rotatedStepDirection);

  if (!anyPointAt(newPosition, obstacles)) {
    player.position = newPosition;
  }

  const didMove = !areIdentical(player.position, playerStartPosition);

  if (didMove) {
    playSound(sounds.step);
    moveElementTo(player.element, player.position);
    player.lastMoveTime = now;
  }

  clicks.forEach(position => {
    flashImageAt(images.explosion, position);
  });
}

function tick() {
  processInput();
  drawShadow(shadowAlphaGrid);
  drawAim();
  clicks = [];
}

function initGame() {
  player.position = [9, 9];

  moveElementTo(player.element, player.position);
  renderWorld();
  setInterval(tick, FRAME_TIME);
}

function initCssVariables() {
  document.documentElement.style.setProperty('--cell-width', `${cellWidth}`);
  document.documentElement.style.setProperty('--cell-height', `${cellHeight}`);
}

function boot() {
  setupEventListeners();
  initCssVariables();
  initGame();
}

boot();
