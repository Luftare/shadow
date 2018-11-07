const playerInput = {
  keysDown: {},
  clicks: [],
};

function resetHandledInputs() {
  playerInput.clicks = [];
}

function setupEventListeners({ player, shadowAlphaGrid }) {
  const { canvas } = dom.elements;

  window.addEventListener('keydown', ({ key }) => {
    playerInput.keysDown[key.toLocaleLowerCase()] = true;
  });

  window.addEventListener('keyup', ({ key }) => {
    playerInput.keysDown[key.toLocaleLowerCase()] = false;
  });

  canvas.addEventListener('mousemove', ({ x, y }) => {
    const { left: offsetX, top: offsetY } = canvas.getBoundingClientRect();
    const canvasPosition = [x - offsetX, y - offsetY];
    const gridPosition = screenToGrid(canvasPosition);
    player.aim = gridPosition;
  });

  canvas.addEventListener('mousedown', e => {
    e.preventDefault();
    const withinSight = shadowAlphaGrid[player.aim[0]][player.aim[1]] < 1;

    if (withinSight) {
      playerInput.clicks.push([...player.aim]);
      audio.playSound(audio.sounds.shot);
    }
  });
}
