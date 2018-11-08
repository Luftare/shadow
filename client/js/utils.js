function getCameraOffset({ player }) {
  const x = Math.ceil(player.position[0] - CAMERA_VIEW_WIDTH / 2);
  const y = Math.ceil(player.position[1] - CAMERA_VIEW_HEIGHT / 2);
  const minX = 0;
  const minY = 0;
  const maxX = GRID_CELLS_X - CAMERA_VIEW_WIDTH;
  const maxY = GRID_CELLS_Y - CAMERA_VIEW_HEIGHT;
  const clampedX = Math.min(Math.max(x, minX), maxX);
  const clampedY = Math.min(Math.max(y, minY), maxY);

  return [clampedX, clampedY];
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
  return [
    Math.max(0, Math.min(GRID_CELLS_X - 1, x)),
    Math.max(0, Math.min(GRID_CELLS_Y - 1, y)),
  ];
}

function fill(size, fn) {
  return [...Array(size)].map((_, i) => fn(i));
}
