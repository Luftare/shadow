const itemsArray = [
  {
    name: 'sniper',
    magazineSize: 1,
    damage: 45,
    aimedShotOnly: true,
    reloadTime: 2000,
    recoil: true,
    aim: {
      sight: 20,
      fieldOfView: 67 * (Math.PI / 180),
    },
    state: {
      bullets: 5,
      magazine: 0,
    },
    localState: {
      lastShotTime: 0,
    },
  },
  {
    name: 'pistol',
    magazineSize: 7,
    reloadTime: 1000,
    damage: 15,
    state: {
      bullets: 14,
      magazine: 0,
    },
    localState: {
      lastShotTime: 0,
    },
  },
  {
    name: 'mp5',
    magazineSize: 20,
    reloadTime: 2000,
    damage: 15,
    autoFire: {
      rateTime: 100,
    },
    aim: {
      sight: 12,
      fieldOfView: 68 * (Math.PI / 180),
    },
    state: {
      bullets: 20,
      magazine: 0,
    },
    localState: {
      lastShotTime: 0,
    },
  },
];

const itemsObject = itemsArray.reduce(
  (acc, item) => ({ ...acc, [item.name]: item }),
  {}
);

try {
  module.exports = {
    itemsArray,
    itemsObject,
  };
} catch (err) {}
