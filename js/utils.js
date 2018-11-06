function gridToScreen(gridPos) {
  return gridPos.map((val, i) => val * (i === 0 ? CELL_WIDTH : CELL_HEIGHT));
}

function screenToGrid(screenPos) {
  return screenPos.map((val, i) =>
    Math.floor(val / (i === 0 ? CELL_WIDTH : CELL_HEIGHT))
  );
}

function fill(size, fn) {
  return [...Array(size)].map((_, i) => fn(i));
}
