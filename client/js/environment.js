function drawScaledImageTo(image, x, y, scale, ctx) {
  let imgX = x + CELL_WIDTH * (1 - scale) * 0.5;
  let imgY = y + CELL_HEIGHT * (1 - scale) * 0.5;
  ctx.drawImage(image, imgX, imgY, CELL_WIDTH * scale, CELL_HEIGHT * scale);
}

function renderStaticEnvironment({ obstacles }) {
  dom.elements.canvas.width = dom.elements.canvas.width; //clear canvas;
  const ctx = dom.elements.canvas.getContext('2d');

  ctx.fillStyle = '#a70';
  obstacles.forEach(columns => {
    columns.forEach(obstacle => {
      if (obstacle) {
        const [x, y] = gridToScreen(obstacle);
        const type = obstacle[2];

        switch (type) {
          case OBJECT_TREE:
            drawScaledImageTo(dom.elements.images.tree, x, y, 1.5, ctx);
            break;
          case OBJECT_WALL:
            drawScaledImageTo(dom.elements.images.wall, x, y, 1, ctx);
            break;

          default:
            break;
        }
      }
    });
  });
}
