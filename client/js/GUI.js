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
  const alivePlayers =
    opponents.filter(opponent => opponent.hp > 0).length + self;
  const totalPlayers = opponents.length + 1;
  dom.elements.alivePlayers.innerHTML = `${alivePlayers}/${totalPlayers}`;
  dom.elements.zoneTime.innerHTML = Math.round(timeToNextZoneShrink / 1000);
}

function updateModal({ opponents, player }) {
  hideModal();
  const enoughPlayers = opponents.length > 0;
  const anyOpponentAlive = opponents.some(opponent => opponent.hp > 0);
  if (enoughPlayers) {
    if (anyOpponentAlive) {
      if (player.hp <= 0) {
        showModalText('Died...<br>waiting for next round');
      }
    } else {
      showModalText('Win!<br>next round starting...');
    }
  } else {
    showModalText('Waiting for players...');
  }
}

function updateGunStatus({ player }) {
  const gun = getActiveGun(player);
  if (gun) {
    dom.elements.gunStatusImage.style.backgroundImage = `url('images/${
      gun.name
    }.png')`;
    dom.elements.gunStatusBullets.innerHTML = gun.state.bullets;
  }
}

function drawGUI(state) {
  const { zone, nextZone, player } = state;
  updateModal(state);
  drawZones(zone, nextZone);
  updateHpBar(player);
  updateGUINumbers(state);
  updateGunStatus(state);
}
