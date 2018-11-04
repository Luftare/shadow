function areIdentical(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}

function gridToScreen(gridPos) {
  return gridPos.map((val, i) => val * (i === 0 ? cellWidth : cellHeight));
}

function screenToGrid(screenPos) {
  return screenPos.map((val, i) =>
    Math.floor(val / (i === 0 ? cellWidth : cellHeight))
  );
}

function fill(size, fn) {
  return [...Array(size)].map((_, i) => fn(i));
}

function moveElementTo(element, [x, y]) {
  element.style.top = `${y * cellHeight}px`;
  element.style.left = `${x * cellWidth}px`;
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

  for (let x = startX; x < endX; x++) {
    for (let y = startY; y < endY; y++) {
      const cell = [x, y];
      if (pointsDistanceLessThan(cell, player.position, player.sight)) {
        const cellCenter = cell.map(val => val + 0.5);
        if (!obstaclesBetweenPoints(playerCenter, cellCenter, obstacles)) {
          const distance = Math.sqrt(squaredDistance(playerCenter, cellCenter));
          grid[x][y] = Math.pow(distance / player.sight, 4);
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
