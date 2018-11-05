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

function revealPlayerZone(player, grid) {
  const startX = Math.floor(Math.max(0, player.position[0] - player.sight));
  const startY = Math.floor(Math.max(0, player.position[1] - player.sight));
  const endX = Math.floor(
    Math.min(GRID_CELLS_X, player.position[0] + player.sight)
  );
  const endY = Math.floor(
    Math.min(GRID_CELLS_Y, player.position[1] + player.sight)
  );
  const playerCenter = player.position.map(val => val + 0.5);
  const toMouse = normalise(subtract(player.aim, player.position));

  for (let x = startX; x < endX; x++) {
    for (let y = startY; y < endY; y++) {
      const cell = [x, y];
      if (pointsDistanceLessThan(cell, player.position, player.sight)) {
        const cellCenter = cell.map(val => val + 0.5);
        if (!obstaclesBetweenPoints(playerCenter, cellCenter, obstacles)) {
          const toCell = normalise(subtract(cell, player.position));
          const dotProduct = dot(toCell, toMouse);
          const cellAtMouseDirection =
            dotProduct > (Math.PI - PLAYER_FIELD_OF_VIEW) * 0.5;
          if (cellAtMouseDirection) {
            const distance = Math.sqrt(
              squaredDistance(playerCenter, cellCenter)
            );
            grid[x][y] = Math.pow(distance / player.sight, 4);
          }
        }
        if (obstacles.some(([oX, oY]) => x === oX && y === oY)) {
          grid[x][y] = 0;
        }
      }
    }
  }
}

function revealAimZone(player, grid) {
  const startX = Math.floor(Math.max(0, player.aim[0] - player.aimSight));
  const startY = Math.floor(Math.max(0, player.aim[1] - player.aimSight));
  const endX = Math.floor(
    Math.min(GRID_CELLS_X, player.aim[0] + player.aimSight)
  );
  const endY = Math.floor(
    Math.min(GRID_CELLS_Y, player.aim[1] + player.aimSight)
  );
  const aimCenter = player.aim.map(val => val + 0.5);
  const playerCenter = player.position.map(val => val + 0.5);

  for (let x = startX; x < endX; x++) {
    for (let y = startY; y < endY; y++) {
      const cell = [x, y];
      if (pointsDistanceLessThan(cell, player.aim, player.aimSight)) {
        const cellCenter = cell.map(val => val + 0.5);
        if (!obstaclesBetweenPoints(playerCenter, cellCenter, obstacles)) {
          const distance = Math.sqrt(squaredDistance(aimCenter, cellCenter));
          grid[x][y] = Math.min(
            grid[x][y],
            Math.pow(distance / player.aimSight, 4)
          );
        }
        if (obstacles.some(([oX, oY]) => x === oX && y === oY)) {
          grid[x][y] = 0;
        }
      }
    }
  }
}
