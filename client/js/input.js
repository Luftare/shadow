const input = {
  state: {
    keysDown: {},
    clicks: [],
  },

  setupEventListeners() {
    const { canvas } = dom.elements;

    window.addEventListener('keydown', ({ key }) => {
      this.state.keysDown[key.toLocaleLowerCase()] = true;
    });

    window.addEventListener('keyup', ({ key }) => {
      this.state.keysDown[key.toLocaleLowerCase()] = false;
    });

    canvas.addEventListener('mousemove', ({ x, y }) => {
      const { player } = game.state;
      const { left: offsetX, top: offsetY } = canvas.getBoundingClientRect();
      const canvasPosition = [x - offsetX, y - offsetY];
      const gridPosition = screenToGrid(canvasPosition);
      player.aim = gridPosition;
    });

    canvas.addEventListener('mousedown', e => {
      e.preventDefault();
      const { x, y } = e;
      const { left: offsetX, top: offsetY } = canvas.getBoundingClientRect();
      const canvasPosition = [x - offsetX, y - offsetY];
      const gridPosition = screenToGrid(canvasPosition);
      handleClickAt(gridPosition);
    });
  },

  reset() {
    this.state.clicks = [];
  },
};
