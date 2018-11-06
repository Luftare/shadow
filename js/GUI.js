function drawAim() {
  const ctx = elements.shadowCanvas.getContext('2d');
  ctx.globalAlpha = 1;
  const [aimX, aimY] = gridToScreen(player.aim);
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 3;
  ctx.rect(aimX, aimY, CELL_WIDTH, CELL_HEIGHT);
  ctx.stroke();
}
