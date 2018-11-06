# Shadow game

Multiplayer survival game. https://luftare.github.io/shadow/ (WIP).

## Backlog

### Multiplayer

- add hosting server
- add server that keeps up with the game state
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
- player has inventory
  - 2 slots for guns
- items can be looted if there are free slots in inventory
- guns can be dropped and dropping on top of another gun will swap the currently equipped gun
- two guns can be equipped and selected from
- gun shot damage is determined by how close to the center of the cell is clicked

### Items

- guns can be swapped
- damage is proportional of distance and modified by equipped gun
- guns have reload time
- guns have limited ammo

### Menu

- player is prompted a nickname before entering game

### Visual fx

- receiving damage blinks screen red
- shooting shakes the screen to recoil direction
- obstacles have type and custom sprites
  - wall
  - tree
  - rock

### Audio fx

- audio source direction will change pan
- sound level declines over distance

### Assets

- sprites:
  - player
  - wall
  - tree
  - opponent
  - guns and other loot...

### Misc

- player rotates towards the mouse direction
- opponents rotate to their facing

## Maybe?

## Done

- rendering is done on layered canvases
  - map and static obstacles are rendered only once
  - players are rendered as html elements and shot fx is rendered as element
  - shadow is renderd on its own canvas including aim
- player movement is transitioned
- Player only sees at the direction of mouse with limited cone of 180 degrees
- WASD movement is rotated along with the facing so that W always moves the player towards the aim direction (up/down/left/right)
