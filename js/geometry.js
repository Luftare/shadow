function segmentsIntersecting(
  [p0_x, p0_y],
  [p1_x, p1_y],
  [p2_x, p2_y],
  [p3_x, p3_y]
) {
  const s1_x = p1_x - p0_x;
  const s1_y = p1_y - p0_y;
  const s2_x = p3_x - p2_x;
  const s2_y = p3_y - p2_y;

  const s =
    (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) /
    (-s2_x * s1_y + s1_x * s2_y);
  const t =
    (s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) /
    (-s2_x * s1_y + s1_x * s2_y);

  return s > 0 && s < 1 && t >= 0 && t <= 1;
}

function squaredDistance([aX, aY], [bX, bY]) {
  return (aX - bX) ** 2 + (aY - bY) ** 2;
}

function pointsDistanceLessThan(a, b, distance) {
  return squaredDistance(a, b) < distance ** 2;
}

function obstacleToSegments([x, y]) {
  return [
    [[x, y], [x + 1, y]],
    [[x, y], [x, y + 1]],
    [[x + 1, y + 1], [x, y + 1]],
    [[x + 1, y + 1], [x + 1, y]],
  ];
}

function anyPointAt([x, y], points) {
  return points.some(([pX, pY]) => x === pX && y === pY);
}

function obstaclesBetweenPoints(a, b, obstacles) {
  return obstacles.some(obstacle => {
    const segments = obstacleToSegments(obstacle);
    return segments.some(segment => segmentsIntersecting(...segment, a, b));
  });
}

function areIdentical(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}

function moveElementTo(element, [x, y]) {
  element.style.top = `${y * CELL_HEIGHT}px`;
  element.style.left = `${x * CELL_WIDTH}px`;
}

function getAdjacentCells([x, y]) {
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

function isZero([x, y]) {
  return x === 0 && y === 0;
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
