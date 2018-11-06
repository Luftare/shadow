function drawAim() {
  shadowCtx.globalAlpha = 1;
  const [aimX, aimY] = gridToScreen(player.aim);
  shadowCtx.strokeStyle = 'white';
  shadowCtx.lineWidth = 3;
  shadowCtx.rect(aimX, aimY, cellWidth, cellHeight);
  shadowCtx.stroke();
}
