const getPixels = require('get-pixels');

const colorCodeSumToType = [...Array(255 + 255 + 255 + 3)].map((_, i) => {
  switch (i) {
    case 0:
      return 'obstacles';
    case 287:
      return 'obstacles';
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
    getPixels('../client/images/mapdata.png', (err, pixels) => {
      if (err) return console.log('Failed with pixel read...');

      const [width, height, dimensions] = pixels.shape.slice();
      const pixelCount = width * height * dimensions;

      const mapData = {
        obstacles: [],
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
