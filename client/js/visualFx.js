const images = {
  explosion: 'images/explosion.png',
};

function drawStaticCellImageAt(image, [x, y]) {
  const ctx = dom.elements.canvas.getContext('2d');
  drawScaledImageTo(image, ...gridToScreen([x, y]), 1, ctx);
}

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

function applyRecoil() {
  dom.elements.gameContainer.classList.add('fx--recoil');
  setTimeout(() => {
    dom.elements.gameContainer.classList.remove('fx--recoil');
  }, 500);
}

function flashBlurScreen() {
  dom.elements.game.classList.add('fx--blur');
  setTimeout(() => {
    dom.elements.game.classList.remove('fx--blur');
  }, 200);
}

function flashRedScreen() {
  dom.elements.fxOverlay.classList.add('fx--flash');
  setTimeout(() => {
    dom.elements.fxOverlay.classList.remove('fx--flash');
  }, 100);
}
