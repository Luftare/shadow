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

function updateHpBar(player) {
  dom.elements.hpBar.style.width = `${player.hp}%`;
}

function drawGUI({ zone, nextZone, player }) {
  drawZones(zone, nextZone);
  updateHpBar(player);
}
