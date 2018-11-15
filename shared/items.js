const itemsArray = [
  {
    name: 'sniper',
    reloadTime: 1000,
    magazineSize: 5,
    damage: 50,
    aim: {
      sight: 22,
      fieldOfView: 67 * (Math.PI / 180),
    },
    state: {
      bullets: 5,
    },
    aimedShotOnly: true,
  },
  {
    name: 'pistol',
    reloadTime: 0,
    magazineSize: 15,
    damage: 12,
    state: {
      bullets: 15,
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
