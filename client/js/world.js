const world = {
  obstacles: [
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
  ],
};

function renderWorld({ obstacles }) {
  const ctx = dom.elements.canvas.getContext('2d');

  ctx.fillStyle = '#a70';
  obstacles.forEach(obstacle => {
    const [x, y] = gridToScreen(obstacle);
    ctx.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT);
  });
}
