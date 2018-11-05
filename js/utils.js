function areIdentical(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}

function gridToScreen(gridPos) {
  return gridPos.map((val, i) => val * (i === 0 ? cellWidth : cellHeight));
}

function screenToGrid(screenPos) {
  return screenPos.map((val, i) =>
    Math.floor(val / (i === 0 ? cellWidth : cellHeight))
  );
}

function fill(size, fn) {
  return [...Array(size)].map((_, i) => fn(i));
}

function moveElementTo(element, [x, y]) {
  element.style.top = `${y * cellHeight}px`;
  element.style.left = `${x * cellWidth}px`;
}

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1];
}

function subtract(a, b) {
  return [a[0] - b[0], a[1] - b[1]];
}

function normalise(vector) {
  let len = length(vector);
  len = len === 0 ? 1 : len;
  return [vector[0] / len, vector[1] / len];
}

function length([x, y]) {
  return Math.sqrt(x ** 2 + y ** 2);
}
