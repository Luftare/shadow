const {
  ZONE_SHRINK_SLEEP_TIME,
  ZONE_DIAMETER_SHRINK_AMOUNT,
  ZONE_MIN_DIAMETER,
} = require('../shared/sharedSocketConfig');

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getNextZone([x, y, width, height]) {
  const zoneReachedMinSize =
    ZONE_MIN_DIAMETER >= width || ZONE_MIN_DIAMETER >= height;
  if (zoneReachedMinSize) return [x, y, width, height];
  const diameterShrink = Math.min(
    ZONE_DIAMETER_SHRINK_AMOUNT,
    width - ZONE_MIN_DIAMETER
  );
  const currentCenter = [Math.floor(x + width / 2), Math.floor(y + height / 2)];
  const newSize = [
    Math.max(ZONE_MIN_DIAMETER, width - diameterShrink),
    Math.max(ZONE_MIN_DIAMETER, height - diameterShrink),
  ];
  const newCenter = currentCenter.map(
    val => val + random(-diameterShrink, diameterShrink) / 3
  );
  return [
    Math.floor(newCenter[0] - newSize[0] / 2),
    Math.floor(newCenter[1] - newSize[1] / 2),
    ...newSize,
  ];
}

function updateZone(state) {
  const { lastZoneShrinkTime } = state;
  const now = Date.now();
  const timeSinceLastZoneShrink = now - lastZoneShrinkTime;
  const enoughTimeSinceLastZoneShrink =
    timeSinceLastZoneShrink > ZONE_SHRINK_SLEEP_TIME;
  state.timeToNextZoneShrink = Math.max(
    0,
    ZONE_SHRINK_SLEEP_TIME - timeSinceLastZoneShrink
  );

  if (enoughTimeSinceLastZoneShrink) {
    state.zone = state.nextZone;
    setTimeout(() => {
      state.nextZone = getNextZone(state.zone);
    }, ZONE_SHRINK_SLEEP_TIME * 0.5);
    state.lastZoneShrinkTime = now;
  }
}

module.exports = {
  updateZone,
};
