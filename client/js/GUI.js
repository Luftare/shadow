function drawAim(position) {
  const ctx = dom.elements.shadowCanvas.getContext('2d');
  ctx.globalAlpha = 1;
  const [aimX, aimY] = gridToScreen(position);
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 3;
  ctx.rect(aimX, aimY, CELL_WIDTH, CELL_HEIGHT);
  ctx.stroke();
  ctx.closePath();
}

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

function drawGUI({ player, zone, nextZone }) {
  drawAim(player.aim);
  drawZones(zone, nextZone);
}
