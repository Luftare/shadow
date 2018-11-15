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

function handlePlayerMovement(keysDown, { player, closebyObstacles, items }) {
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
    const pickedItem = items.find(item =>
      areIdentical(item.position, player.position)
    );
    if (pickedItem) {
      connection.appendItemPickUp(pickedItem);
      audio.playSound(audio.sounds.pickUpGun);
    }
  }
}

function handlePlayerActions({ shift }, { player }) {
  player.aiming = shift;
}

function handleClicks(clicks, state) {
  const { PROPNAME_ID } = sharedConfig;
  clicks.forEach(position => {
    connection.appendGunShot(state.player.position, position);
    state.opponents.forEach(opponent => {
      if (areIdentical(opponent.localPosition, position)) {
        audio.playSound(audio.sounds.hitOpponent, 2);
        connection.appendGunHit(opponent[PROPNAME_ID]);
      }
    });
    flashImageAt(images.explosion, position);
  });
}
