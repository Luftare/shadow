## Backlog

### Multiplayer

- add server
- add server state
- add socket.io connection between client and server
- server buffers players' last 10 positions and tracks the # of each step
- clients play back remote players' position buffer with reduced move wait time to catch up delayed data
- scoring a hit to a remote player is determined by local player's state of the remote players
- remote players receive damage upon click on them
- server will track hp and message deaths

### Gameplay

- a rectangle is displayed around the game field
- rectangle shrinks and players outside will receive damage
- players start without any equipment
- guns can be looted and they have limited ammo

### Menu

- player is prompted a nickname before entering game

### Visual fx

- receiving damage blinks screen red
- shooting shakes the screen to recoil direction

### Audio fx

- audio source direction will change pan
- sound level declines over distance
