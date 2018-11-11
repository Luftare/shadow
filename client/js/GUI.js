function drawZones(zone, nextZone) {
  const screenZone = gridToScreen(zone);
  const screenNextZone = gridToScreen(nextZone);

  dom.elements.zone.style.left = `${screenZone[0]}px`;
  dom.elements.zone.style.top = `${screenZone[1]}px`;
  dom.elements.zone.style.width = `${screenZone[2]}px`;
  dom.elements.zone.style.height = `${screenZone[3]}px`;

  dom.elements.nextZone.style.left = `${screenNextZone[0]}px`;
  dom.elements.nextZone.style.top = `${screenNextZone[1]}px`;
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

function updateGUINumbers({ player, opponents, timeToNextZoneShrink }) {
  const self = player.hp > 0 ? 1 : 0;
  dom.elements.alivePlayers.innerHTML =
    opponents.filter(opponent => opponent.hp > 0).length + self;
  dom.elements.zoneTime.innerHTML = Math.round(timeToNextZoneShrink / 1000);
}

function updateModal({ opponents, player }) {
  if (opponents.length > 0 && !opponents.some(opponent => opponent.hp > 0)) {
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
  updateGUINumbers(state);
}
