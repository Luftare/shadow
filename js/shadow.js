function updateShadow(grid) {
  grid.forEach((col, x) =>
    col.forEach((_, y) => {
      grid[x][y] = 1;
    })
  );

  player.aiming ? revealAimZone(player, grid) : revealPlayerZone(player, grid);
}

function drawShadow(grid) {
  shadowCanvas.width = shadowCanvas.width;
  updateShadow(grid);

  shadowCtx.fillStyle = 'black';
  grid.forEach((col, x) => {
    col.forEach((visible, y) => {
      const [screenX, screenY] = gridToScreen([x, y]);
      shadowCtx.globalAlpha = visible;
      shadowCtx.fillRect(screenX, screenY, cellWidth, cellHeight);
    });
  });
  shadowCtx.globalAlpha = 1;
  const [aimX, aimY] = gridToScreen(player.aim);
  shadowCtx.strokeStyle = 'white';
  shadowCtx.lineWidth = 3;
  shadowCtx.rect(aimX, aimY, cellWidth, cellHeight);
  shadowCtx.stroke();
}

function renderWorld() {
  ctx.fillStyle = '#a70';
  obstacles.forEach(obstacle => {
    const [x, y] = gridToScreen(obstacle);
    ctx.fillRect(x, y, cellWidth, cellHeight);
  });
}
