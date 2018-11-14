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
    const { x, y } = e;
    const { left: offsetX, top: offsetY } = canvas.getBoundingClientRect();
    const canvasPosition = [x - offsetX, y - offsetY];
    const gridPosition = screenToGrid(canvasPosition);
    const withinSight = shadowAlphaGrid[gridPosition[0]][gridPosition[1]] < 1;
    player.aim = gridPosition;

    if (withinSight) {
      const gun = player.items[player.items.length - 1];
      if (gun) {
        const gunCanShoot =
          (gun[2] === 'sniper' && player.aiming) || gun[2] !== 'sniper';
        if (gunCanShoot) {
          playerInput.clicks.push([...player.aim]);
          audio.playSound(audio.sounds[`${gun[2]}Shot`]);
          applyRecoil();
        }
      }
    }
  });
}
