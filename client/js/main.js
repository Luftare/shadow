function processInput({ keysDown, clicks }, state) {
  handlePlayerMovement(keysDown, state);
  handlePlayerActions(keysDown, state);
  handleClicks(clicks, state);
}

function tick(state) {
  syncController.updateOpponents(state.opponents);
  processInput(playerInput, state);
  drawShadow(state);
  drawGUI(state);
  resetHandledInputs();
  connection.requestUpdate();
}

function initGame(world, state) {
  setupEventListeners(state);
  moveElementTo(dom.elements.player, state.player.position);
  renderWorld(world);
  setInterval(() => {
    tick(state);
  }, FRAME_TIME);
}

function boot() {
  dom.init();
  const state = getInitState(world);
  connection.connectToServerSocket(state).then(() => {
    initGame(world, state);
  });
}
