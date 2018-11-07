const audio = {
  sounds: {
    shot: document.getElementById('sound-shot'),
    step: document.getElementById('sound-step'),
  },
  playSound(sound, volume = 0.05) {
    sound.volume = volume;
    sound.pause();
    sound.currentTime = 0;
    sound.playbackRate = Math.random() * 0.5 + 1;
    sound.play();
  },
};
