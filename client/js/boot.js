function tick(state) {
  updateClosebyObstacles(state);
  updateLocalPlayer(state);
  syncController.updateOpponents(state);
  drawShadow(state);
  drawGUI(state);
  followPlayer(state);
  connection.updateStreamData(state);
  connection.requestUpdate();
  dom.updateItems(state);
  resetHandledInputs();
}

function initGame(state) {
  renderStaticEnvironment(state.environment);
  setInterval(() => {
    // logTickDt();
    tick(state);
  }, FRAME_TIME);
}

function boot() {
  dom.init();
  const environment = mapParser.parseImage(dom.elements.mapDataImage);
  const state = getInitState(environment);
  setupEventListeners(state);
  connection.connectToServer(state).then(() => {
    initGame(state);
  });
}
