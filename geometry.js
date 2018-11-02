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

const squaredDistance = ([aX, aY], [bX, bY]) => (aX - bX) ** 2 + (aY - bY) ** 2;

const pointsDistanceLessThan = (a, b, distance) => {
  return squaredDistance(a, b) < distance ** 2;
};

const obstacleToSegments = ([x, y]) => [
  [[x, y], [x + 1, y]],
  [[x, y], [x, y + 1]],
  [[x + 1, y + 1], [x, y + 1]],
  [[x + 1, y + 1], [x + 1, y]],
];

const anyPointAt = ([x, y], points) =>
  points.some(([pX, pY]) => x === pX && y === pY);

const obstaclesBetweenPoints = (a, b, obstacles) => {
  return obstacles.some(obstacle => {
    const segments = obstacleToSegments(obstacle);
    return segments.some(segment => segmentsIntersecting(...segment, a, b));
  });
};
