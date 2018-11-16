function tick(state) {
  updateClosebyObstacles(state);
  processInput(playerInput, state);
  syncController.updateOpponents(state);
  drawShadow(state);
  drawGUI(state);
  followPlayer(state);
  connection.requestUpdate();
  dom.updateItems(state);
  resetHandledInputs();
}

function initGame(state) {
  setupEventListeners(state);
  dom.moveElementTo(dom.elements.player, state.player.position);
  renderStaticWorld(state.world);
  setInterval(() => {
    // logTickDt();
    tick(state);
  }, FRAME_TIME);
}

function boot() {
  dom.init();
  const world = mapParser.parseImage(dom.elements.mapDataImage);
  const state = getInitState(world);
  connection.connectToServerSocket(state).then(() => {
    initGame(state);
  });
}
