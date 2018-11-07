function rotatePlayerMovementTowardsAim(step, player) {
  const aimAxis = toAxis(subtract(player.aim, player.position));
  const aimRadians = Math.PI - aimAxis * 0.5 * Math.PI;
  return roundVector(rotate(step, aimRadians));
}

function getStepDirection({ w: up, s: down, a: left, d: right }) {
  const stepDirection = [0, 0];

  if (right) stepDirection[0] = 1;
  else if (left) stepDirection[0] = -1;
  else if (down) stepDirection[1] = 1;
  else if (up) stepDirection[1] = -1;

  return stepDirection;
}

function handlePlayerMovement(keysDown, { player, obstacles }) {
  const now = Date.now();
  const enoughTimeSinceLastMovement =
    now - player.lastMoveTime > PLAYER_MOVE_SLEEP_TIME;

  if (!enoughTimeSinceLastMovement) return;

  const stepDirection = getStepDirection(keysDown);
  const rotatedStepDirection = rotatePlayerMovementTowardsAim(
    stepDirection,
    player
  );
  const newPosition = sum(player.position, rotatedStepDirection);
  const orderedToMove = !isZero(stepDirection);
  const hasSpaceToMove = !anyPointAt(newPosition, obstacles);
  const willMove = orderedToMove && hasSpaceToMove;

  if (willMove) {
    player.position = newPosition;
    audio.playSound(audio.sounds.step);
    moveElementTo(elements.player, player.position);
    player.lastMoveTime = now;
  }
}

function handlePlayerActions({ shift }, { player }) {
  player.aiming = shift;
}

function handleClicks(clicks, state) {
  clicks.forEach(position => {
    flashImageAt(images.explosion, position);
  });
}
