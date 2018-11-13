function createSoundPool(src) {
  const pool = [...Array(10)].map(() => {
    const element = document.createElement('audio');
    element.src = src;
    return element;
  });

  pool.index = 0;
  return pool;
}

const audio = {
  defaultVolume: 0.05,
  sounds: {
    shot: createSoundPool('audio/shot.mp3'),
    step: createSoundPool('audio/step.wav'),
  },
  playSound(pool, volume = audio.defaultVolume) {
    pool.index = (pool.index + 1) % pool.length;
    const sound = pool[pool.index];
    sound.volume = volume;
    sound.pause();
    sound.currentTime = 0;
    sound.playbackRate = Math.random() * 0.3 + 1;
    sound.play();
  },
  getPointsAudioVolume(a, b) {
    const distance = Math.sqrt(squaredDistance(a, b));
    const decline = 5;
    return audio.defaultVolume * (decline / (decline + distance));
  },
};
