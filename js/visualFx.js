const images = {
  explosion: 'images/explosion.png'
};

function flashImageAt(src, position) {
  const element = document.createElement('img');
  element.src = src;
  element.classList = 'fx--cell fx--flash';
  fxContainer.appendChild(element);
  moveElementTo(element, position);
  setTimeout(() => {
    fxContainer.removeChild(element);
  }, 300);
}
