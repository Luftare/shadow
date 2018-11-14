function processInput({ keysDown, clicks }, state) {
  handlePlayerMovement(keysDown, state);
  handlePlayerActions(keysDown, state);
  handleClicks(clicks, state);
}

function tick(state, world) {
  updateClosebyObstacles(state, world);
  syncController.updateOpponents(state);
  if (state.player.hp > 0) processInput(playerInput, state);
  drawShadow(state);
  drawGUI(state);
  followPlayer(state);
  connection.requestUpdate();
  resetHandledInputs();
  dom.updateItems(state);
}
function initGame(world, state) {
  setupEventListeners(state);
  dom.moveElementTo(dom.elements.player, state.player.position);
  renderWorld(world);
  setInterval(() => {
    // logTickDt();
    window.state = state;
    tick(state, world);
  }, FRAME_TIME);
}

function boot() {
  dom.init();
  const world = mapParser.parseImage(dom.elements.mapDataImage);
  const state = getInitState(world);
  connection.connectToServerSocket(state).then(() => {
    initGame(world, state);
  });
}
