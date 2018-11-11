function drawZones(zone, nextZone) {
  const screenZone = gridToScreen(zone);
  const screenNextZone = gridToScreen(nextZone);

  dom.elements.zone.style.top = `${screenZone[0]}px`;
  dom.elements.zone.style.left = `${screenZone[1]}px`;
  dom.elements.zone.style.width = `${screenZone[2]}px`;
  dom.elements.zone.style.height = `${screenZone[3]}px`;

  dom.elements.nextZone.style.top = `${screenNextZone[0]}px`;
  dom.elements.nextZone.style.left = `${screenNextZone[1]}px`;
  dom.elements.nextZone.style.width = `${screenNextZone[2]}px`;
  dom.elements.nextZone.style.height = `${screenNextZone[3]}px`;
}

function showModalText(text) {
  dom.elements.modal.style.display = 'flex';
  dom.elements.modalHeader.innerHTML = text;
}

function hideModal() {
  dom.elements.modal.style.display = 'none';
}

function updateHpBar(player) {
  dom.elements.hpBar.style.width = `${player.hp}%`;
}

function updateModal({ opponents, player }) {
  if (!opponents.some(opponent => opponent.hp > 0)) {
    showModalText('Win!');
  } else if (player.hp <= 0) {
    showModalText('Meh...');
  } else {
    hideModal();
  }
}

function drawGUI(state) {
  const { zone, nextZone, player } = state;
  updateModal(state);
  drawZones(zone, nextZone);
  updateHpBar(player);
}
