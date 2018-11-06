const shadowAlphaGrid = fill(GRID_CELLS_X, () => fill(GRID_CELLS_Y, () => 1));

function updateShadow(grid) {
  grid.forEach((col, x) =>
    col.forEach((_, y) => {
      grid[x][y] = 1;
    })
  );

  revealPlayerZone(player, grid);
}

function drawShadow(grid) {
  const { shadowCanvas } = elements;
  const ctx = shadowCanvas.getContext('2d');
  shadowCanvas.width = shadowCanvas.width;

  updateShadow(grid);

  ctx.fillStyle = 'black';
  grid.forEach((col, x) => {
    col.forEach((alpha, y) => {
      const [screenX, screenY] = gridToScreen([x, y]);
      ctx.globalAlpha = alpha;
      ctx.fillRect(screenX, screenY, CELL_WIDTH, CELL_HEIGHT);
    });
  });
}

function revealPlayerZone(player, grid) {
  const toMouse = subtract(player.aim, player.position);
  const toMouseNormalised = normalise(toMouse);
  const aimDistance = length(toMouse);
  const aimSight = Math.min(aimDistance + 3, PLAYER_AIM_SIGHT);
  const sight = player.aiming ? aimSight : PLAYER_SIGHT;
  const fieldOfView = player.aiming
    ? PLAYER_AIM_FIELD_OF_VIEW
    : PLAYER_FIELD_OF_VIEW;

  const startX = Math.floor(Math.max(0, player.position[0] - sight));
  const startY = Math.floor(Math.max(0, player.position[1] - sight));
  const endX = Math.floor(Math.min(GRID_CELLS_X, player.position[0] + sight));
  const endY = Math.floor(Math.min(GRID_CELLS_Y, player.position[1] + sight));
  const playerCenter = player.position.map(val => val + 0.5);

  for (let x = startX; x < endX; x++) {
    for (let y = startY; y < endY; y++) {
      const cell = [x, y];
      if (pointsDistanceLessThan(cell, player.position, sight)) {
        const cellCenter = cell.map(val => val + 0.5);
        if (!obstaclesBetweenPoints(playerCenter, cellCenter, obstacles)) {
          const toCellNormalised = normalise(subtract(cell, player.position));
          const dotProduct = dot(toCellNormalised, toMouseNormalised);
          const cellAtMouseDirection =
            dotProduct > (Math.PI - fieldOfView) * 0.5;
          if (cellAtMouseDirection) {
            const distance = Math.sqrt(
              squaredDistance(playerCenter, cellCenter)
            );
            grid[x][y] = Math.pow(distance / sight, 4);
          }
        }
      }
    }
  }

  const visibleObstacles = obstacles.filter(([x, y], i) => {
    const adjacents = obstacleAdjacents[i];
    const hasVisibleAdjacent = adjacents.some(([x, y]) => grid[x][y] < 1);
    return hasVisibleAdjacent;
  });

  visibleObstacles.forEach(([x, y]) => {
    grid[x][y] = 0;
  });
}
