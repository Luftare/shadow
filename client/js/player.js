function updateLocalPlayer(state) {
  processInput(input.state, state);
  dom.moveElementTo(dom.elements.player, state.player.position);
}

function processInput({ keysDown, keysDownOnce, clicks, mouseDown }, state) {
  if (state.player.hp <= 0) return;
  handlePlayerMovement(keysDown, state);
  handlePlayerActions(keysDown, keysDownOnce, mouseDown, state);
  handleClicks(clicks, state);
}

function followPlayer(state) {
  const cameraOffset = getCameraOffset(state);
  const screenCameraOffset = gridToScreen(cameraOffset);
  dom.elements.game.style.transform = `translate(${-screenCameraOffset[0]}px, ${-screenCameraOffset[1]}px)`;
}

function getStepDirection({ w: up, s: down, a: left, d: right }) {
  const stepDirection = [0, 0];

  if (right) stepDirection[0] = 1;
  else if (left) stepDirection[0] = -1;
  else if (down) stepDirection[1] = 1;
  else if (up) stepDirection[1] = -1;

  return stepDirection;
}

function updatePlayerTransform(element, angle) {
  element.style.transform = `rotate(${(angle * 180) / Math.PI}deg) scale(1.3)`;
}

function handlePlayerMovement(keysDown, { player, closebyObstacles, items }) {
  const angle = vectorAngle(subtract(player.aim, player.position));
  updatePlayerTransform(dom.elements.player, angle);

  if (keysDown.shift) return; //cant move while aiming
  const now = Date.now();
  const enoughTimeSinceLastMovement =
    now - player.lastMoveTime > PLAYER_MOVE_SLEEP_TIME;

  if (!enoughTimeSinceLastMovement) return;

  const stepDirection = getStepDirection(keysDown);
  const newPosition = clampToGrid(sum(player.position, stepDirection));
  const orderedToMove = !isZero(stepDirection);
  const hasSpaceToMove = !anyPointAt(newPosition, closebyObstacles);
  const willMove = orderedToMove && hasSpaceToMove;

  if (willMove) {
    player.position = newPosition;
    connection.appendNewPosition(player.position);
    audio.playSound(audio.sounds.step);
    dom.moveElementTo(dom.elements.player, player.position);
    player.lastMoveTime = now;
  }
}

function handlePlayerActions(
  keysDown,
  keysDownOnce,
  mouseDown,
  { player, shadowAlphaGrid, items }
) {
  const { shift } = keysDown;
  const { f: pickUp, g: dropItem, r: reload } = keysDownOnce;
  const gun = getActiveGun(player);
  const now = Date.now();

  const canSwitchGun = !player.reloading;

  player.pullingTrigger = mouseDown;

  if (canSwitchGun) {
    const previousItemIndex = player.activeItemIndex;
    if (keysDown['1']) player.activeItemIndex = 0;
    if (keysDown['2']) player.activeItemIndex = 1;

    player.activeItemIndex = Math.max(
      0,
      Math.min(player.items.length - 1, player.activeItemIndex)
    );

    if (previousItemIndex !== player.activeItemIndex) {
      connection.appendSwitchGun(player.activeItemIndex);
      audio.playSound(audio.sounds.gunReload);
    }
  }

  const itemUnderPlayer = items.find(item =>
    areIdentical(item.position, player.position)
  );
  const activeItem = getActiveGun(player);
  const canPickUp = !player.reloading && !player.aiming;

  if (canPickUp && pickUp) {
    if (itemUnderPlayer) {
      const spaceInInventory = player.items.length < 2;
      const itemTypeUnderPlayerInInventory = player.items.find(
        item => itemUnderPlayer.name === item.name
      );
      if (
        spaceInInventory ||
        (!spaceInInventory && itemTypeUnderPlayerInInventory)
      ) {
        connection.appendItemPickUp(itemUnderPlayer);
        audio.playSound(audio.sounds.pickUpGun);
      } else {
        audio.playSound(audio.sounds.error);
        dom.appendGameLogMessage('Inventory full!');
      }
    }
  }

  const canDrop = !player.reloading && !player.aiming;

  if (canDrop && dropItem) {
    if (activeItem) {
      connection.appendDropItem(activeItem);
      audio.playSound(audio.sounds.dropItem);
    }
  }

  const canAim = !player.reloading;

  if (canAim) {
    player.aiming = shift;
  }

  const canReload =
    gun &&
    gun.state.magazine < gun.magazineSize &&
    gun.state.bullets > 0 &&
    !player.reloading;

  if (canReload && reload) {
    player.reloading = true;
    connection.appendGunReload();

    setTimeout(() => {
      audio.playSound(audio.sounds.gunReload);
    }, Math.max(0, gun.reloadTime - 1000));

    setTimeout(() => {
      player.reloading = false;
    }, gun.reloadTime);
  }

  const canAutoFire =
    gun &&
    gun.autoFire &&
    player.pullingTrigger &&
    gun.state.magazine > 0 &&
    !player.reloading;
  const withinSight = shadowAlphaGrid[player.aim[0]][player.aim[1]] < 1;
  if (canAutoFire) {
    if (withinSight) {
      const bulletReady =
        now - gun.localState.lastShotTime > gun.autoFire.rateTime;
      if (bulletReady) {
        if (!gun.localState.sound) {
          gun.localState.sound = audio.playSound(
            audio.sounds[gun.name + 'Shot']
          );
        }
        input.state.clicks.push([...player.aim]);
        gun.localState.lastShotTime = now;
      }
    }
  }

  if (gun && gun.autoFire && gun.localState.sound) {
    if (
      !withinSight ||
      !player.pullingTrigger ||
      gun.state.magazine <= 0 ||
      player.reloading
    ) {
      gun.localState.sound.pause();
      delete gun.localState.sound;
    }
  }

  dom.elements.player.src = dom.getPlayerImage(player);
}

function handleClicks(clicks, state) {
  if (state.player.reloading) return;
  const { PROPNAME_ID } = sharedConfig;
  clicks.forEach(position => {
    connection.appendGunShot(
      state.player.position,
      position,
      state.player.activeItemIndex
    );
    state.opponents.forEach(opponent => {
      if (areIdentical(opponent.localPosition, position)) {
        audio.playSound(audio.sounds.hitOpponent, 2);
        connection.appendGunHit(opponent[PROPNAME_ID]);
      }
    });
    flashImageAt(images.explosion, position);
  });
}

function handleClickAt(gridPosition) {
  const { player, shadowAlphaGrid } = game.state;
  const withinSight = shadowAlphaGrid[gridPosition[0]][gridPosition[1]] < 1;
  player.aim = gridPosition;
  if (withinSight) {
    const gun = getActiveGun(player);
    if (gun) {
      if (!player.aiming && gun.aimedShotOnly) return;
      if (gun.state.magazine > 0) {
        if (!gun.autoFire) {
          input.state.clicks.push([...player.aim]);
          audio.playSound(audio.sounds[`${gun.name}Shot`]);
          if (gun.recoil) applyRecoil();
        }
      } else {
        audio.playSound(audio.sounds.emptyMagazineSound);
      }
    }
  }
}
