function drawScaledImageTo(image, x, y, scale, ctx) {
  let imgX = x + CELL_WIDTH * (1 - scale) * 0.5;
  let imgY = y + CELL_HEIGHT * (1 - scale) * 0.5;
  ctx.drawImage(image, imgX, imgY, CELL_WIDTH * scale, CELL_HEIGHT * scale);
}

function renderStaticEnvironment({ trees, walls }) {
  dom.elements.canvas.width = dom.elements.canvas.width; //clear canvas;
  const ctx = dom.elements.canvas.getContext('2d');

  trees.forEach(obstacle => {
    const [x, y] = gridToScreen(obstacle);
    drawScaledImageTo(dom.elements.images.tree, x, y, 1.5, ctx);
  });

  walls.forEach(obstacle => {
    const [x, y] = gridToScreen(obstacle);
    drawScaledImageTo(dom.elements.images.wall, x, y, 1, ctx);
  });
}
