const itemsArray = [
  {
    name: 'sniper',
    reloadTime: 1000,
    magazineSize: 5,
    damage: 60,
    aimedShotOnly: true,
    reloadTime: 3000,
    recoil: true,
    aim: {
      sight: 22,
      fieldOfView: 67 * (Math.PI / 180),
    },
    state: {
      bullets: 5,
    },
    localState: {
      lastShotTime: 0,
    },
  },
  {
    name: 'pistol',
    magazineSize: 15,
    reloadTime: 0,
    damage: 12,
    state: {
      bullets: 15,
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
