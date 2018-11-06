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

function boot() {
  initDom();
  setupEventListeners();
  connection.connectToServerSocket().then(initGame);
}
