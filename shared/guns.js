const guns = [
  {
    aim: {
      sight: 22,
      fieldOfView: 67 * (Math.PI / 180),
    },
    damage: 50,
    aimedShotOnly: true,
    name: 'sniper',
  },
  {
    damage: 20,
    name: 'pistol',
  },
].reduce((acc, item) => ({ ...acc, [item.name]: item }), {});

try {
  module.exports = guns;
} catch (err) {}
