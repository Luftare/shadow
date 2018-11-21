class Game {
  constructor() {
    dom.init();
    input.setupEventListeners();

    this.active = false;
    dom.showView(dom.elements.views.login);
  }

  login(name) {
    return connection.connectToServer(this, name);
  }

  tick() {
    const { state } = this;
    updateClosebyObstacles(state);
    updateLocalPlayer(state);
    syncController.updateOpponents(state);
    drawShadow(state);
    drawGUI(state);
    followPlayer(state);
    connection.updateStreamData(state);
    connection.requestUpdate();
    dom.updateItems(state);
    input.reset();
  }

  restart(environment, serverState) {
    this.stop();
    this.init(environment, serverState);
    this.start();
  }

  init(environment, serverState) {
    const { GRID_CELLS_X, GRID_CELLS_Y, PROPNAME_ID } = sharedConfig;

    dom.reset();

    const serverPlayer = serverState.players.find(
      player => player[PROPNAME_ID] === connection.id
    );

    const player = {
      hp: serverPlayer.hp,
      lastMoveTime: 0,
      position: serverPlayer.spawnPoint,
      items: serverPlayer.items,
      aim: [0, 0],
      aiming: false,
      reloading: false,
      pullingTrigger: false,
      activeItemIndex: 0,
      lastShotTime: 0,
      ranking: 0,
    };

    const zone = [0, 0, GRID_CELLS_X, GRID_CELLS_Y];
    const nextZone = zone;

    const shadowAlphaGrid = fill(GRID_CELLS_X, () =>
      fill(GRID_CELLS_Y, () => 1)
    );

    const obstacles = [...environment.walls, ...environment.trees];
    const obstacleGrid = fill(GRID_CELLS_X, x =>
      fill(GRID_CELLS_Y, y => {
        if (obstacles.some(([oX, oY]) => oX === x && oY === y)) {
          return 1;
        } else {
          return 0;
        }
      })
    );
    const closebyObstacles = [];
    const opponents = [];
    const timeToNextZoneShrink = 0;
    const items = [];

    this.state = {
      player,
      zone,
      nextZone,
      opponents,
      shadowAlphaGrid,
      obstacles: obstacleGrid,
      closebyObstacles,
      environment,
      timeToNextZoneShrink,
      items,
    };

    renderStaticEnvironment(environment);
  }

  start() {
    const { state } = this;
    this.active = true;
    this.intervalId = setInterval(() => {
      this.tick(state);
    }, FRAME_TIME);
  }

  stop() {
    clearInterval(this.intervalId);
    this.active = false;
  }
}
