function processInput({ keysDown, clicks }, state) {
  handlePlayerMovement(keysDown, state);
  handlePlayerActions(keysDown, state);
  handleClicks(clicks, state);
}

function tick(state) {
  processInput(playerInput, state);
  drawShadow(state);
  drawGUI(state);
  resetHandledInputs();
}

function initGame(world) {
  const state = getInitState(world);
  setupEventListeners(state);
  moveElementTo(elements.player, state.player.position);
  renderWorld(world);
  setInterval(() => {
    tick(state);
  }, FRAME_TIME);
}

function boot() {
  initDom();
  connection.connectToServerSocket().then(() => {
    initGame(world);
  });
}
