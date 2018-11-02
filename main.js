const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
let keysDown = {};

const GRID_CELLS_X = 20;
const GRID_CELLS_Y = 20;
const FRAME_TIME = 100;
const cellWidth = canvas.width / GRID_CELLS_X;
const cellHeight = canvas.height / GRID_CELLS_Y;

window.addEventListener('keydown', ({ key }) => {
  keysDown[key] = true;
});

window.addEventListener('keyup', ({ key }) => {
  keysDown[key] = false;
});

const screen = gridPos => gridPos.map(val => val * cellWidth);

const fill = (size, fn) => {
  return [...Array(size)].map((_, i) => fn(i));
};

const smokeGrid = fill(GRID_CELLS_X, x => fill(GRID_CELLS_Y, y => 1));

const player = {
  speed: 1,
  position: [9, 9],
  sight: 15,
};

const obstacles = [
  [0, 0],
  [10, 10],
  [10, 11],
  [10, 12],
  [10, 13],
  [4, 14],
  [5, 14],
  [6, 14],
  [7, 14],
  [6, 6],
  [5, 16],
];

const processInput = () => {
  const { w: up, s: down, a: left, d: right } = keysDown;
  const { speed } = player;

  if (down) player.position[1] += speed;
  if (up) player.position[1] -= speed;
  if (right) player.position[0] += speed;
  if (left) player.position[0] -= speed;
};

const updateSmoke = cols => {
  cols.forEach((col, x) =>
    col.forEach((_, y) => {
      cols[x][y] = 1;
    })
  );

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
          cols[x][y] = Math.pow(distance / player.sight, 4);
        }
      }
    }
  }
};

const drawSmoke = cols => {
  ctx.fillStyle = 'black';
  cols.forEach((col, x) => {
    col.forEach((visible, y) => {
      const [screenX, screenY] = screen([x, y]);
      ctx.globalAlpha = visible;
      ctx.fillRect(screenX, screenY, cellWidth, cellHeight);
      if (!visible) {
      }
    });
  });
  ctx.globalAlpha = 1;
};

const render = () => {
  canvas.width = canvas.width;

  ctx.fillStyle = '#33f';
  const [playerX, playerY] = screen(player.position);
  ctx.fillRect(playerX, playerY, cellWidth, cellHeight);

  updateSmoke(smokeGrid);
  drawSmoke(smokeGrid);

  ctx.fillStyle = '#aa0';
  obstacles.forEach(obstacle => {
    const [x, y] = screen(obstacle);
    ctx.fillRect(x, y, cellWidth, cellHeight);
  });
};

const tick = () => {
  processInput();
  render();
};

setInterval(tick, FRAME_TIME);
