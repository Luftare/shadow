const mapParser = {
  obstacleTypes: [OBJECT_WALL, OBJECT_TREE],
  conversions: {
    '0,0,0': OBJECT_WALL,
    '34,177,76': OBJECT_TREE,
    '63,72,204': OBJECT_LOOT_SPAWN_POINT,
    '237,28,36': OBJECT_PLAYER_SPAWN_POINT,
  },
  convertPixelDataToGameObject(pixelData) {
    const pixelString = `${pixelData[0]},${pixelData[1]},${pixelData[2]}`;
    return this.conversions[pixelString];
  },
  createGameObject(...object) {
    return object;
  },
  parseImage(image) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const width = image.width;
    const height = image.height;
    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(image, 0, 0);
    const data = {
      obstacles: [],
      [OBJECT_LOOT_SPAWN_POINT]: [],
      [OBJECT_PLAYER_SPAWN_POINT]: [],
    };
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const type = this.convertPixelDataToGameObject(
          ctx.getImageData(i, j, 1, 1).data
        );
        if (type) {
          const gameObject = this.createGameObject(i, j, type);

          if (this.obstacleTypes.includes(type)) {
            data.obstacles.push(gameObject);
          } else {
            data[type].push(gameObject);
          }
        }
      }
    }
    return data;
  },
};
