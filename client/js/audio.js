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
    pistolShot: createSoundPool('audio/shot-pistol.mp3'),
    sniperShot: createSoundPool('audio/shot-sniper.mp3'),
    pickUpGun: createSoundPool('audio/pick-up-gun.mp3'),
    emptyMagazineSound: createSoundPool('audio/gun-reload.mp3'),
    gunReload: createSoundPool('audio/empty-magazine-sound.mp3'),
    step: createSoundPool('audio/step.mp3'),
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
