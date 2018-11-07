function getInitState(world) {
  const player = {
    lastMoveTime: 0,
    position: [9, 9],
    aim: [-10, -10],
    aiming: false,
  };

  const shadowAlphaGrid = fill(GRID_CELLS_X, () => fill(GRID_CELLS_Y, () => 1));
  const obstacles = world.obstacles;
  const obstacleAdjacents = obstacles.map(getAdjacentCells);
  const opponents = [];

  return {
    player,
    opponents,
    shadowAlphaGrid,
    obstacles,
    obstacleAdjacents,
  };
}
