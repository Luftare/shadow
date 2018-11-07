function drawAim(position) {
  const ctx = dom.elements.shadowCanvas.getContext('2d');
  ctx.globalAlpha = 1;
  const [aimX, aimY] = gridToScreen(position);
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 3;
  ctx.rect(aimX, aimY, CELL_WIDTH, CELL_HEIGHT);
  ctx.stroke();
}

function drawGUI({ player }) {
  drawAim(player.aim);
}
