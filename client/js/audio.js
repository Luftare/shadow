const audio = {
  defaultVolume: 0.05,
  sounds: {
    shot: document.getElementById('sound-shot'),
    step: document.getElementById('sound-step'),
  },
  playSound(sound, volume = audio.defaultVolume) {
    sound.volume = volume;
    sound.pause();
    sound.currentTime = 0;
    sound.playbackRate = Math.random() * 0.5 + 1;
    sound.play();
  },
  getPointsAudioVolume(a, b) {
    const distance = Math.sqrt(squaredDistance(a, b));
    const decline = 5;
    return audio.defaultVolume * (decline / (decline + distance));
  },
};
