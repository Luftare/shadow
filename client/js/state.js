function getInitState(world) {
  const { GRID_CELLS_X, GRID_CELLS_Y } = sharedSocketConfig;

  const player = {
    hp: 100,
    lastMoveTime: 0,
    position: [9, 9],
    aim: [-10, -10],
    aiming: false,
  };

  const zone = [0, 0, GRID_CELLS_X, GRID_CELLS_Y];
  const nextZone = zone;

  const shadowAlphaGrid = fill(GRID_CELLS_X, () => fill(GRID_CELLS_Y, () => 1));
  const obstacles = world.obstacles;
  const closebyObstacles = [];
  const obstacleAdjacents = obstacles.map(getAdjacentCells);
  const opponents = [];

  return {
    player,
    zone,
    nextZone,
    opponents,
    shadowAlphaGrid,
    obstacles,
    closebyObstacles,
    obstacleAdjacents,
    world,
  };
}
