const dom = {
  init() {
    const { canvas, shadowCanvas } = dom.elements;

    document.documentElement.style.setProperty('--cell-width', `${CELL_WIDTH}`);
    document.documentElement.style.setProperty(
      '--cell-height',
      `${CELL_HEIGHT}`
    );

    canvas.width = shadowCanvas.width = GAME_SCREEN_WIDTH;
    canvas.height = shadowCanvas.height = GAME_SCREEN_HEIGHT;
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
    canvas: document.querySelector('.game__world'),
    shadowCanvas: document.querySelector('.game__shadow'),
    fxContainer: document.querySelector('.game__fx'),
    player: document.querySelector('.game__player'),
    opponents: document.querySelector('.game__opponents'),
  },
};
