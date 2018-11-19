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

document
  .querySelector('.login__name-input')
  .addEventListener('input', ({ target }) => {
    const button = document.querySelector('.login__submit-button');
    if (target.value.length > 10 || target.value.length < 2) {
      button.disabled = true;
    } else {
      button.disabled = false;
    }
  });

document
  .querySelector('.login__name-input')
  .addEventListener('keydown', ({ key }) => {
    const canSubmit = !document.querySelector('.login__submit-button').disabled;
    if (key === 'Enter' && canSubmit) {
      document.querySelector('.login__submit-button').click();
    }
  });

document.querySelector('.login__name-input').focus();
