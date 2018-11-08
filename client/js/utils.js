function getCameraOffset({ player }) {
  const x = Math.ceil(player.position[0] - CAMERA_VIEW_WIDTH / 2);
  const y = Math.ceil(player.position[1] - CAMERA_VIEW_HEIGHT / 2);

  return [x, y];
}

function gridToScreen(gridPos) {
  return gridPos.map((val, i) => val * (i === 0 ? CELL_WIDTH : CELL_HEIGHT));
}

function screenToGrid(screenPos) {
  return screenPos.map((val, i) =>
    Math.floor(val / (i === 0 ? CELL_WIDTH : CELL_HEIGHT))
  );
}

function clampToGrid([x, y]) {
  const { GRID_CELLS_X, GRID_CELLS_Y } = sharedSocketConfig;

  return [
    Math.max(0, Math.min(GRID_CELLS_X - 1, x)),
    Math.max(0, Math.min(GRID_CELLS_Y - 1, y)),
  ];
}

function fill(size, fn) {
  return [...Array(size)].map((_, i) => fn(i));
}
