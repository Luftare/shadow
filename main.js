const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
let keysDown = {};
let clicks = [];

const GRID_CELLS_X = 20;
const GRID_CELLS_Y = 20;
const FRAME_TIME = 40;
const cellWidth = canvas.width / GRID_CELLS_X;
const cellHeight = canvas.height / GRID_CELLS_Y;

const sounds = {
  shot: document.getElementById('sound-shot'),
  step: document.getElementById('sound-step')
};

const playSound = (audio, volume = 0.05) => {
  audio.volume = volume;
  audio.pause();
  audio.currentTime = 0;
  audio.playbackRate = Math.random() * 0.5 + 1;
  audio.play();
};

window.addEventListener('keydown', ({ key }) => {
  keysDown[key.toLocaleLowerCase()] = true;
});

window.addEventListener('keyup', ({ key }) => {
  keysDown[key.toLocaleLowerCase()] = false;
});

canvas.addEventListener('mousemove', ({ x, y }) => {
  const { left: offsetX, top: offsetY } = canvas.getBoundingClientRect();
  const canvasPosition = [x - offsetX, y - offsetY];
  const gridPosition = grid(canvasPosition);
  player.aim = gridPosition;
});

canvas.addEventListener('mousedown', e => {
  e.preventDefault();
  const withinSight = smokeAlphaGrid[player.aim[0]][player.aim[1]] < 1;
  if (withinSight) {
    clicks.push([...player.aim]);
    playSound(sounds.shot);
  }
});

const areIdentical = (a, b) => a[0] === b[0] && a[1] === b[1];

const screen = gridPos =>
  gridPos.map((val, i) => val * (i === 0 ? cellWidth : cellHeight));

const grid = screenPos =>
  screenPos.map((val, i) =>
    Math.floor(val / (i === 0 ? cellWidth : cellHeight))
  );

const fill = (size, fn) => {
  return [...Array(size)].map((_, i) => fn(i));
};

const smokeAlphaGrid = fill(GRID_CELLS_X, x => fill(GRID_CELLS_Y, y => 1));

const player = {
  lastMoveTime: 0,
  moveWaitTime: 400,
  speed: 1,
  position: [9, 9],
  sight: 5,
  aim: [0, 0],
  aimSight: 3,
  aiming: false
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
  [5, 16]
];

const processInput = () => {
  const { w: up, s: down, a: left, d: right, shift } = keysDown;
  const { speed } = player;
  const newPosition = player.position.map(val => val);
  const playerStartPosition = player.position;
  const now = Date.now();
  const canMove = now - player.lastMoveTime > player.moveWaitTime;

  if (canMove) {
    if (right) newPosition[0] += speed;
    else if (left) newPosition[0] -= speed;
    else if (down) newPosition[1] += speed;
    else if (up) newPosition[1] -= speed;
  }

  player.aiming = shift;

  if (!anyPointAt(newPosition, obstacles)) {
    player.position = newPosition;
  }

  const didMove = !areIdentical(player.position, playerStartPosition);

  if (didMove) {
    playSound(sounds.step);
    player.lastMoveTime = now;
  }
};

const revealPlayerZone = cols => {
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
        if (obstacles.some(([oX, oY]) => x === oX && y === oY)) {
          cols[x][y] = 0;
        }
      }
    }
  }
};

const revealAimZone = cols => {
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
          cols[x][y] = Math.min(
            cols[x][y],
            Math.pow(distance / player.aimSight, 4)
          );
        }
        if (obstacles.some(([oX, oY]) => x === oX && y === oY)) {
          cols[x][y] = 0;
        }
      }
    }
  }
};

const updateSmoke = cols => {
  cols.forEach((col, x) =>
    col.forEach((_, y) => {
      cols[x][y] = 1;
    })
  );
  player.aiming ? revealAimZone(cols) : revealPlayerZone(cols);
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

  ctx.fillStyle = '#aa0';
  obstacles.forEach(obstacle => {
    const [x, y] = screen(obstacle);
    ctx.fillRect(x, y, cellWidth, cellHeight);
  });

  updateSmoke(smokeAlphaGrid);
  drawSmoke(smokeAlphaGrid);

  const [aimX, aimY] = screen(player.aim);
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 3;
  ctx.rect(aimX, aimY, cellWidth, cellHeight);
  ctx.stroke();

  clicks.forEach(target => {
    const [x, y] = screen(target);
    ctx.fillStyle = 'orange';
    ctx.fillRect(x, y, cellWidth, cellHeight);
  });
};

const tick = () => {
  processInput();
  render();
  clicks = [];
};

setInterval(tick, FRAME_TIME);
