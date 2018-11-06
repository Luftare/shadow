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
