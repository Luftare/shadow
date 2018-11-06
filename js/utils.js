function areIdentical(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}

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

function adjacentCells([x, y]) {
  const result = [];
  const startX = Math.max(0, x - 1);
  const startY = Math.max(0, y - 1);
  const endX = Math.min(x + 1, GRID_CELLS_X);
  const endY = Math.min(y + 1, GRID_CELLS_Y);

  for (let i = startX; i <= endX; i++) {
    for (let j = startY; j <= endY; j++) {
      if (i !== x && j !== y) {
        result.push([i, j]);
      }
    }
  }

  return result;
}

function moveElementTo(element, [x, y]) {
  element.style.top = `${y * CELL_HEIGHT}px`;
  element.style.left = `${x * CELL_WIDTH}px`;
}

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1];
}

function cross(a, b) {
  return a[0] * b[1] - a[1] * b[0];
}

function subtract(a, b) {
  return [a[0] - b[0], a[1] - b[1]];
}

function sum(a, b) {
  return [a[0] + b[0], a[1] + b[1]];
}

function normalise(vector) {
  let len = length(vector);
  len = len === 0 ? 1 : len;
  return [vector[0] / len, vector[1] / len];
}

function length([x, y]) {
  return Math.sqrt(x ** 2 + y ** 2);
}

function toAxis([x, y]) {
  const vertical = Math.abs(y) > Math.abs(x);
  if (vertical) {
    if (y > 0) return 0;
    else return 2;
  } else {
    if (x > 0) return 1;
    else return 3;
  }
}

function roundVector([x, y]) {
  return [Math.round(x), Math.round(y)];
}

function rotate([x, y], radians) {
  const s = Math.sin(radians);
  const c = Math.cos(radians);
  const nX = x * c - y * s;
  const nY = x * s + y * c;
  return [nX, nY];
}
