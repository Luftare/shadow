const input = {
  state: {
    keysDown: {},
    keysDownOnce: {},
    clicks: [],
    mouseDown: false,
  },

  //[eventname, callback]
  on: [],

  setupEventListeners() {
    const { canvas } = dom.elements;

    window.addEventListener('keydown', ({ key }) => {
      this.state.keysDown[key.toLocaleLowerCase()] = true;
      this.state.keysDownOnce[key.toLocaleLowerCase()] = true;
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
      connection.appendPullTrigger();
      this.state.mouseDown = true;
      const { x, y } = e;
      const { left: offsetX, top: offsetY } = canvas.getBoundingClientRect();
      const canvasPosition = [x - offsetX, y - offsetY];
      const gridPosition = screenToGrid(canvasPosition);
      handleClickAt(gridPosition);
    });

    window.addEventListener('mouseup', e => {
      this.state.mouseDown = false;
      connection.appendReleaseTrigger();
      this.on.forEach(([name, cb]) => {
        if (name === 'mouseup') {
          cb(e);
        }
      });
      this.on = this.on.filter(sub => sub[0] !== 'mouseup');
    });
  },

  reset() {
    this.state.clicks = [];
    this.state.keysDownOnce = {};
  },
};
