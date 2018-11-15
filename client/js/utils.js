function logTickDt() {
  const now = Date.now();
  const dt = now - logTickDt.then;
  logTickDt.then = now;
  console.log(dt);
}

logTickDt.then = Date.now();

function getActiveGun(player) {
  return player.items[player.items.length - 1];
}

function getCameraOffset({ player }) {
  const x = Math.ceil(player.position[0] - CAMERA_VIEW_WIDTH / 2);
  const y = Math.ceil(player.position[1] - CAMERA_VIEW_HEIGHT / 2);

  return [x, y];
}

function gridToScreen(gridPos) {
  return gridPos.map((val, i) => {
    if (isNaN(val)) {
      return val;
    } else {
      return val * (i === 0 ? CELL_WIDTH : CELL_HEIGHT);
    }
  });
}

function screenToGrid(screenPos) {
  return screenPos.map((val, i) => {
    if (isNaN(val)) {
      return val;
    } else {
      return Math.floor(val / (i === 0 ? CELL_WIDTH : CELL_HEIGHT));
    }
  });
}

function clampToGrid([x, y]) {
  const { GRID_CELLS_X, GRID_CELLS_Y } = sharedConfig;

  return [
    Math.max(0, Math.min(GRID_CELLS_X - 1, x)),
    Math.max(0, Math.min(GRID_CELLS_Y - 1, y)),
  ];
}

function fill(size, fn) {
  return [...Array(size)].map((_, i) => fn(i));
}
