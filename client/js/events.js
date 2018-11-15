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
      const gun = getActiveGun(player);
      if (gun) {
        console.log(gun);
        if (!player.aiming && gun.aimedShotOnly) return;
        if (gun.state.bullets > 0) {
          playerInput.clicks.push([...player.aim]);
          audio.playSound(audio.sounds[`${gun.name}Shot`]);
          applyRecoil();
        } else {
          audio.playSound(audio.sounds.emptyMagazineSound);
        }
      }
    }
  });
}
