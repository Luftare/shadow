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

function drawZone({ topLeft, size }) {
  const ctx = dom.elements.shadowCanvas.getContext('2d');
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.rect(...gridToScreen(topLeft), ...gridToScreen(size));
  ctx.stroke();
}

function drawGUI({ player, zone }) {
  drawAim(player.aim);
  drawZone(zone);
}
