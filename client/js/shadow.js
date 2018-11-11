function drawShadow(state) {
  const { shadowAlphaGrid } = state;
  const { shadowCanvas } = dom.elements;
  const ctx = shadowCanvas.getContext('2d');
  shadowCanvas.width = shadowCanvas.width;

  updateShadow(state);

  ctx.fillStyle = 'black';
  shadowAlphaGrid.forEach((col, x) => {
    col.forEach((alpha, y) => {
      const [screenX, screenY] = gridToScreen([x, y]);
      ctx.globalAlpha = alpha;
      ctx.fillRect(screenX, screenY, CELL_WIDTH, CELL_HEIGHT);
    });
  });
}

function updateShadow(state) {
  const { shadowAlphaGrid } = state;
  shadowAlphaGrid.forEach((columns, x) =>
    columns.forEach((_, y) => {
      shadowAlphaGrid[x][y] = 1;
    })
  );

  revealPlayerZone(state);
}

function updateClosebyObstacles(state) {
  const { player, obstacles } = state;
  const { GRID_CELLS_X, GRID_CELLS_Y } = sharedSocketConfig;
  state.closebyObstacles = [];
  const startX = Math.max(0, player.position[0] - PLAYER_AIM_SIGHT);
  const startY = Math.max(0, player.position[1] - PLAYER_AIM_SIGHT);
  const endX = Math.min(player.position[0] + PLAYER_AIM_SIGHT, GRID_CELLS_X);
  const endY = Math.min(player.position[1] + PLAYER_AIM_SIGHT, GRID_CELLS_Y);

  for (let x = startX; x < endX; x++) {
    for (let y = startY; y < endY; y++) {
      if (obstacles[x][y]) {
        state.closebyObstacles.push(obstacles[x][y]);
      }
    }
  }
}

function revealPlayerZone({
  player,
  closebyObstacles,
  obstacleAdjacents,
  shadowAlphaGrid,
}) {
  const { GRID_CELLS_X, GRID_CELLS_Y } = sharedSocketConfig;
  const toMouse = subtract(player.aim, player.position);
  const toMouseNormalised = normalise(toMouse);
  const aimDistance = length(toMouse);
  const aimSight = Math.min(aimDistance + 5, PLAYER_AIM_SIGHT);
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
        if (
          !obstaclesBetweenPoints(playerCenter, cellCenter, closebyObstacles)
        ) {
          const toCellNormalised = normalise(subtract(cell, player.position));
          const dotProduct = dot(toCellNormalised, toMouseNormalised);
          const cellAtMouseDirection =
            dotProduct > (Math.PI - fieldOfView) * 0.5;
          if (cellAtMouseDirection) {
            const distance = Math.sqrt(
              squaredDistance(playerCenter, cellCenter)
            );
            shadowAlphaGrid[x][y] = distance / sight;
          }
        }
      }
    }
  }

  closebyObstacles.forEach(obstacle => {
    const [x, y] = obstacle;
    const distance = Math.sqrt(squaredDistance(player.position, obstacle));
    shadowAlphaGrid[x][y] = distance / PLAYER_AIM_SIGHT;
  });
}
