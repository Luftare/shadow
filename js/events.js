const setupEventListeners = () => {
  window.addEventListener('keydown', ({ key }) => {
    keysDown[key.toLocaleLowerCase()] = true;
  });

  window.addEventListener('keyup', ({ key }) => {
    keysDown[key.toLocaleLowerCase()] = false;
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
      clicks.push([...player.aim]);
      playSound(sounds.shot);
    }
  });
};
