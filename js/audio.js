const sounds = {
  shot: document.getElementById('sound-shot'),
  step: document.getElementById('sound-step')
};

const playSound = (audio, volume = 0.05) => {
  audio.volume = volume;
  audio.pause();
  audio.currentTime = 0;
  audio.playbackRate = Math.random() * 0.5 + 1;
  audio.play();
};
