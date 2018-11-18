let game;

document
  .querySelector('.login__submit-button')
  .addEventListener('click', () => {
    const name = document.querySelector('.login__name-input').value;
    game = new Game();
    game.login(name).then(() => {
      dom.showView(dom.elements.views.lobby);
    });
  });
