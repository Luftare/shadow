const input = {
  state: {
    keysDown: {},
    clicks: [],
  },

  setupEventListeners() {
    const { canvas } = dom.elements;

    window.addEventListener('keydown', ({ key }) => {
      this.state.keysDown[key.toLocaleLowerCase()] = true;
    });

    window.addEventListener('keyup', ({ key }) => {
      this.state.keysDown[key.toLocaleLowerCase()] = false;
    });

    canvas.addEventListener('mousemove', ({ x, y }) => {
      const { player } = game.state;
      const { left: offsetX, top: offsetY } = canvas.getBoundingClientRect();
      const canvasPosition = [x - offsetX, y - offsetY];
      const gridPosition = screenToGrid(canvasPosition);
      player.aim = gridPosition;
    });

    canvas.addEventListener('mousedown', e => {
      e.preventDefault();
      const { player, shadowAlphaGrid } = game.state;
      const { x, y } = e;
      const { left: offsetX, top: offsetY } = canvas.getBoundingClientRect();
      const canvasPosition = [x - offsetX, y - offsetY];
      const gridPosition = screenToGrid(canvasPosition);
      const withinSight = shadowAlphaGrid[gridPosition[0]][gridPosition[1]] < 1;
      player.aim = gridPosition;
      if (withinSight) {
        const gun = getActiveGun(player);
        if (gun) {
          const now = Date.now();
          if (!player.aiming && gun.aimedShotOnly) return;
          if (gun.state.bullets > 0) {
            if (now - player.lastShotTime > gun.reloadTime) {
              player.lastShotTime = now;
              this.state.clicks.push([...player.aim]);
              audio.playSound(audio.sounds[`${gun.name}Shot`]);
              if (gun.recoil) applyRecoil();
              if (gun.reloadTime > 0) {
                setTimeout(() => {
                  audio.playSound(audio.sounds.gunReload);
                }, gun.reloadTime * 0.8);
              }
            }
          } else {
            audio.playSound(audio.sounds.emptyMagazineSound);
          }
        }
      }
    });
  },

  reset() {
    this.state.clicks = [];
  },
};
