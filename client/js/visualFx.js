const images = {
  explosion: 'images/explosion.png',
};

function flashImageAt(src, position) {
  const { fxContainer } = dom.elements;
  const element = document.createElement('img');
  element.src = src;
  element.classList = 'fx--cell fx--flash';
  fxContainer.appendChild(element);
  dom.moveElementTo(element, position);
  setTimeout(() => {
    fxContainer.removeChild(element);
  }, 500);
}

function flashBlurScreen() {
  dom.elements.game.classList.add('fx--blur');
  setTimeout(() => {
    dom.elements.game.classList.remove('fx--blur');
  }, 200);
}
