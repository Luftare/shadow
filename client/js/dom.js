const dom = {
  shotIndicatorFlashTimeoutId: null,
  init() {
    const { canvas, shadowCanvas } = dom.elements;
    const { GRID_CELLS_X, GRID_CELLS_Y } = sharedConfig;

    document.documentElement.style.setProperty('--cell-width', `${CELL_WIDTH}`);
    document.documentElement.style.setProperty(
      '--cell-height',
      `${CELL_HEIGHT}`
    );

    document.documentElement.style.setProperty(
      '--game-environment-width',
      `${CELL_WIDTH * GRID_CELLS_X}px`
    );
    document.documentElement.style.setProperty(
      '--game-environment-height',
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
    document.documentElement.style.setProperty(
      '--player-move-sleep-time',
      `${PLAYER_MOVE_SLEEP_TIME}ms`
    );
    document.documentElement.style.setProperty(
      '--opponent-move-sleep-time',
      `${OPPONENT_MOVE_SLEEP_TIME}ms`
    );

    canvas.width = shadowCanvas.width = GAME_SCREEN_WIDTH;
    canvas.height = shadowCanvas.height = GAME_SCREEN_HEIGHT;
  },
  reset() {
    this.elements.opponents.innerHTML = '';
  },
  moveElementTo(element, [x, y]) {
    element.style.top = `${y * CELL_HEIGHT}px`;
    element.style.left = `${x * CELL_WIDTH}px`;
  },
  createOpponentElement(opponent) {
    const element = document.createElement('img');
    element.classList = 'game__opponent';
    dom.elements.opponents.appendChild(element);
    return element;
  },
  removeOpponentElement(element) {
    dom.elements.opponents.removeChild(element);
  },
  indicateShotAtDirection(position, { player }) {
    const toShot = subtract(position, player.position);
    const angle = vectorAngle(toShot);
    const degrees = (angle * 180) / Math.PI;
    dom.elements.fxShotIndicator.style.transform = `translate(-50%, -50%) rotate(${degrees}deg)`;
    dom.elements.fxShotIndicator.classList.add('fx--flash');
    clearTimeout(dom.shotIndicatorFlashTimeoutId);
    dom.shotIndicatorFlashTimeoutId = setTimeout(() => {
      dom.elements.fxShotIndicator.classList.remove('fx--flash');
    }, 150);
  },
  clearItems() {
    dom.elements.itemsContainer.innerHTML = '';
    dom.elements.fxContainer.innerHTML = '';
  },
  updateItems({ items }) {
    if (dom.elements.items.length < items.length) {
      const missingCount = items.length - dom.elements.items.length;
      [...Array(missingCount)].forEach(() => {
        const element = document.createElement('div');
        element.classList.add('game__item');
        dom.elements.itemsContainer.appendChild(element);
        dom.elements.items.push(element);
      });
    }

    dom.elements.items.forEach((itemElement, i) => {
      if (items.length < i) {
        itemElement.classList.add('game__item--hidden');
      } else {
        itemElement.classList.remove('game__item--hidden');
        const item = items[i];
        if (item) {
          const [x, y] = gridToScreen(item.position);
          itemElement.style.left = `${x}px`;
          itemElement.style.top = `${y}px`;
          itemElement.setAttribute('data-item', items[i].name);
        }
      }
    });
  },
  playerGunImages: {
    none: 'images/player.png',
    pistol: 'images/player-pistol.gif',
    sniper: 'images/player-sniper.png',
    mp5: 'images/player-mp5.png',
  },
  getPlayerImage(player) {
    const gun = getActiveGun(player);
    return gun ? dom.playerGunImages[gun.name] : dom.playerGunImages['none'];
  },
  appendGameLogMessage(msg) {
    const element = document.createElement('div');
    element.classList.add('game-log__message');
    element.innerHTML = msg;
    dom.elements.gameLogContainer.appendChild(element);
    setTimeout(() => {
      dom.elements.gameLogContainer.removeChild(element);
    }, 20000);
  },
  showView(view) {
    Object.keys(dom.elements.views).forEach(viewName => {
      dom.elements.views[viewName].classList.remove('view--active');
    });
    view.classList.add('view--active');
  },
  elements: {
    inventorySlots: [...Array(4)].map((_, i) => {
      return document.querySelector(`.inventory__slot[data-num='${i}']`);
    }),
    items: [],
    images: {
      tree: document.getElementById('image-tree'),
      wall: document.getElementById('image-wall'),
      blood: document.getElementById('image-blood'),
    },
    views: {
      login: document.querySelector('.view--login'),
      lobby: document.querySelector('.view--lobby'),
      game: document.querySelector('.view--game'),
    },
    gameLogContainer: document.querySelector('.game-log'),
    gunStatus: document.querySelector('.gun-status'),
    gunStatusImage: document.querySelector('.gun-status__image'),
    gunStatusBullets: document.querySelector('.gun-status__bullets'),
    fxOverlay: document.querySelector('.fx__overlay'),
    fxShotIndicator: document.querySelector('.fx__shot-indicator'),
    hpBar: document.querySelector('.GUI__hp-bar'),
    zone: document.getElementById('zone'),
    nextZone: document.getElementById('next-zone'),
    mapDataImage: document.getElementById('map-data-image'),
    itemsContainer: document.querySelector('.game__items'),
    game: document.querySelector('.game'),
    gameContainer: document.querySelector('.game__container'),
    canvas: document.querySelector('.game__environment'),
    shadowCanvas: document.querySelector('.game__shadow'),
    fxContainer: document.querySelector('.game__fx'),
    player: document.querySelector('.game__player'),
    opponents: document.querySelector('.game__opponents'),
    modal: document.querySelector('.modal'),
    modalHeader: document.querySelector('.modal__header'),
    zoneTime: document.querySelector('.GUI__zone-time'),
    alivePlayers: document.querySelector('.GUI__alive-players'),
  },
};
