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
  defaultVolume: 0.4,
  sounds: {
    pistolShot: createSoundPool('audio/shot-pistol.mp3'),
    sniperShot: createSoundPool('audio/shot-sniper.mp3'),
    pickUpGun: createSoundPool('audio/pick-up-gun.mp3'),
    emptyMagazineSound: createSoundPool('audio/empty-magazine-sound.mp3'),
    gunReload: createSoundPool('audio/gun-reload.mp3'),
    step: createSoundPool('audio/step.mp3'),
    ouch: createSoundPool('audio/ouch.mp3'),
    hitOpponent: createSoundPool('audio/hit-opponent.mp3'),
    win: createSoundPool('audio/win.mp3'),
    lose: createSoundPool('audio/lose.mp3'),
  },
  playSound(pool, volume = 1) {
    pool.index = (pool.index + 1) % pool.length;
    const sound = pool[pool.index];
    sound.volume = Math.min(1, volume * audio.defaultVolume);
    sound.pause();
    sound.currentTime = 0;
    sound.playbackRate = Math.random() * 0.3 + 1;
    sound.play();
  },
  getPointsAudioVolume(a, b) {
    const distance = Math.sqrt(squaredDistance(a, b));
    const decline = 5;
    return decline / (decline + distance);
  },
};
