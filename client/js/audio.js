function createSoundPool(name) {
  const pool = [...Array(10)].map(() => {
    const element = document.createElement('audio');
    element.src = `audio/${name}.mp3`;
    return element;
  });

  pool.index = 0;
  return pool;
}

const audio = {
  defaultVolume: 0.4,
  sounds: {
    pistolShot: createSoundPool('shot-pistol'),
    sniperShot: createSoundPool('shot-sniper'),
    mp5Shot: createSoundPool('shot-mp5'),
    pickUpGun: createSoundPool('pick-up-gun'),
    emptyMagazineSound: createSoundPool('empty-magazine-sound'),
    gunReload: createSoundPool('gun-reload'),
    step: createSoundPool('step'),
    ouch: createSoundPool('ouch'),
    hitOpponent: createSoundPool('hit-opponent'),
    win: createSoundPool('win'),
    lose: createSoundPool('lose'),
    dropItem: createSoundPool('drop-item'),
  },
  playSound(pool, volume = 1) {
    pool.index = (pool.index + 1) % pool.length;
    const sound = pool[pool.index];
    sound.volume = Math.min(1, volume * audio.defaultVolume);
    sound.pause();
    sound.currentTime = 0;
    sound.playbackRate = Math.random() * 0.3 + 1;
    sound.play();
    return sound;
  },
  getPointsAudioVolume(a, b) {
    const distance = Math.sqrt(squaredDistance(a, b));
    const decline = 5;
    return decline / (decline + distance);
  },
};
