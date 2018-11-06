const obstacles = [
  [0, 0],
  [10, 10],
  [10, 11],
  [10, 12],
  [10, 13],
  [4, 14],
  [5, 14],
  [6, 14],
  [7, 14],
  [6, 6],
  [5, 16],
];

const obstacleAdjacents = obstacles.map(adjacentCells);

function renderWorld() {
  ctx.fillStyle = '#a70';
  obstacles.forEach(obstacle => {
    const [x, y] = gridToScreen(obstacle);
    ctx.fillRect(x, y, cellWidth, cellHeight);
  });
}
