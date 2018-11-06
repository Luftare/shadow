function handlePlayerMovement({ w: up, s: down, a: left, d: right }) {
  const now = Date.now();
  const canMove = now - player.lastMoveTime > PLAYER_MOVE_SLEEP_TIME;

  if (!canMove) return;

  const stepDirection = [0, 0];
  const playerStartPosition = player.position;

  if (right) stepDirection[0] = 1;
  else if (left) stepDirection[0] = -1;
  else if (down) stepDirection[1] = 1;
  else if (up) stepDirection[1] = -1;

  const aimAxis = toAxis(subtract(player.aim, player.position));
  const aimRadians = Math.PI - aimAxis * 0.5 * Math.PI;
  const rotatedStepDirection = roundVector(rotate(stepDirection, aimRadians));
  const newPosition = sum(player.position, rotatedStepDirection);
  const obstacleBlockingMovement = anyPointAt(newPosition, obstacles);

  if (!obstacleBlockingMovement) {
    player.position = newPosition;
  }

  const didMove = !areIdentical(player.position, playerStartPosition);

  if (didMove) {
    playSound(sounds.step);
    moveElementTo(elements.player, player.position);
    player.lastMoveTime = now;
  }
}

function handlePlayerActions({ shift }) {
  player.aiming = shift;
}

function handleClicks(clicks) {
  clicks.forEach(position => {
    flashImageAt(images.explosion, position);
  });
}

function processInput({ keysDown, clicks }) {
  handlePlayerMovement(keysDown);
  handlePlayerActions(keysDown);
  handleClicks(clicks);
}

function tick() {
  processInput(playerInput);
  drawShadow(shadowAlphaGrid);
  drawAim();
  resetHandledInputs();
}

function initGame() {
  player.position = [9, 9];

  moveElementTo(elements.player, player.position);
  renderWorld();
  setInterval(tick, FRAME_TIME);
}

function initStyles() {
  const { canvas, shadowCanvas } = elements;
  document.documentElement.style.setProperty('--cell-width', `${CELL_WIDTH}`);
  document.documentElement.style.setProperty('--cell-height', `${CELL_HEIGHT}`);

  canvas.width = shadowCanvas.width = GAME_SCREEN_WIDTH;
  canvas.height = shadowCanvas.height = GAME_SCREEN_HEIGHT;
}

function boot() {
  initStyles();
  setupEventListeners();
  initGame();
}
