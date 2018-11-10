function renderWorld({ obstacles }) {
  const ctx = dom.elements.canvas.getContext('2d');

  ctx.fillStyle = '#a70';
  obstacles.forEach(columns => {
    columns.forEach(obstacle => {
      if (obstacle) {
        const [x, y] = gridToScreen(obstacle);
        ctx.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT);
      }
    });
  });
}
