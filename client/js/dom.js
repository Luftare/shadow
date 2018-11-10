const dom = {
  init() {
    const { canvas, shadowCanvas } = dom.elements;
    const { GRID_CELLS_X, GRID_CELLS_Y } = sharedSocketConfig;

    document.documentElement.style.setProperty('--cell-width', `${CELL_WIDTH}`);
    document.documentElement.style.setProperty(
      '--cell-height',
      `${CELL_HEIGHT}`
    );

    document.documentElement.style.setProperty(
      '--game-world-width',
      `${CELL_WIDTH * GRID_CELLS_X}px`
    );
    document.documentElement.style.setProperty(
      '--game-world-height',
      `${CELL_HEIGHT * GRID_CELLS_Y}px`
    );
    document.documentElement.style.setProperty(
      '--game-screen-width',
      `${CELL_WIDTH * CAMERA_VIEW_WIDTH}px`
    );
    document.documentElement.style.setProperty(
      '--game-screen-height',
      `${CELL_HEIGHT * CAMERA_VIEW_HEIGHT}px`
    );

    canvas.width = shadowCanvas.width = GAME_SCREEN_WIDTH;
    canvas.height = shadowCanvas.height = GAME_SCREEN_HEIGHT;
  },
  moveElementTo(element, [x, y]) {
    element.style.top = `${y * CELL_HEIGHT}px`;
    element.style.left = `${x * CELL_WIDTH}px`;
  },
  createOpponentElement() {
    const element = document.createElement('div');
    element.classList = 'game__opponent';
    dom.elements.opponents.appendChild(element);
    return element;
  },
  removeOpponentElement(element) {
    dom.elements.opponents.removeChild(element);
  },
  elements: {
    zone: document.getElementById('zone'),
    nextZone: document.getElementById('next-zone'),
    mapDataImage: document.getElementById('map-data-image'),
    game: document.querySelector('.game'),
    canvas: document.querySelector('.game__world'),
    shadowCanvas: document.querySelector('.game__shadow'),
    fxContainer: document.querySelector('.game__fx'),
    player: document.querySelector('.game__player'),
    opponents: document.querySelector('.game__opponents'),
  },
};
