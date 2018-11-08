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

function requestZoneShrink(state) {
  const { lastZoneShrinkTime } = state;
  const now = Date.now();
  const timeSinceLastZoneShrink = now - lastZoneShrinkTime;
  const enoughTimeSinceLastZoneShrink =
    timeSinceLastZoneShrink > ZONE_SHRINK_SLEEP_TIME;

  if (enoughTimeSinceLastZoneShrink) {
    state.zone = state.nextZone;
    state.nextZone = getNextZone(state.zone);
    state.lastZoneShrinkTime = now;
  }
}

module.exports = {
  requestZoneShrink,
};
