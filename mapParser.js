const getPixels = require('get-pixels');

// 0, 0, 0 = wall,
// 34, 177, 76 = tree,
// 63, 72, 204 = loot spawn point
// 237, 28, 36 = player spawn point

const colorCodeSumToType = [...Array(255 + 255 + 255 + 3)].map((_, i) => {
  switch (i) {
    case 0:
      return 'walls';
    case 287:
      return 'trees';
    case 301:
      return 'playerSpawnPoints';
    case 339:
      return 'itemSpawnPoints';
    default:
      return null;
  }
});

function getMapData() {
  return new Promise(res => {
    getPixels('./client/images/mapdata.png', (err, pixels) => {
      if (err) return console.log('Failed with pixel read...');

      const [width, height, dimensions] = pixels.shape.slice();
      const pixelCount = width * height * dimensions;

      const mapData = {
        trees: [],
        walls: [],
        playerSpawnPoints: [],
        itemSpawnPoints: [],
      };

      const data = pixels.data;

      for (let i = 0; i < pixelCount; i += dimensions) {
        const pixelSum = data[i] + data[i + 1] + data[i + 2];

        const type = colorCodeSumToType[pixelSum];

        if (type) {
          const x = (i / dimensions) % width;
          const y = Math.floor(i / dimensions / width);
          mapData[type].push([x, y]);
        }
      }
      res(mapData);
    });
  });
}

module.exports = { getMapData };
