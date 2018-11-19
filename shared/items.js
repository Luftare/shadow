const itemsArray = [
  {
    name: 'sniper',
    reloadTime: 1000,
    magazineSize: 1,
    damage: 40,
    aimedShotOnly: true,
    reloadTime: 2000,
    recoil: true,
    aim: {
      sight: 22,
      fieldOfView: 67 * (Math.PI / 180),
    },
    state: {
      bullets: 5,
      magazine: 1,
    },
    localState: {
      lastShotTime: 0,
    },
  },
  {
    name: 'pistol',
    magazineSize: 7,
    reloadTime: 1000,
    damage: 12,
    state: {
      bullets: 14,
      magazine: 7,
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
