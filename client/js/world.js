function renderWorld({ obstacles }) {
  const ctx = dom.elements.canvas.getContext('2d');

  const colors = {
    [OBJECT_TREE]: '#8c3f00',
    [OBJECT_WALL]: 'darkgrey',
  };

  ctx.fillStyle = '#a70';
  obstacles.forEach(columns => {
    columns.forEach(obstacle => {
      if (obstacle) {
        const [x, y] = gridToScreen(obstacle);
        const type = obstacle[2];
        ctx.fillStyle = colors[type];

        ctx.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT);
      }
    });
  });
}
