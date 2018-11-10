# Shadow game

Multiplayer survival game.

## Install

- cd server
- npm install
- npm run dev
- --> localhost:8000

## Backlog

### Multiplayer

#### Server

- players outside zone will receive damage
- server test scored hits and does not apply shots from already dead players
- server keeps track of player that have connected during the game and will show them as observers

#### Client

- notify who won last game
- client figures out if damage is received by comparing local hp to server update hp
- scoring a hit to a remote player is determined by local player's state of the remote players
- remote players receive damage upon click on them
- clients remove dead opponents
- frags are notified to all players
- number of players is notified

### Gameplay

- gun shot damage is determined by how close to the center of the cell is clicked
- dead players will be able to see the whole game field without shadow to observe other players

### Items

- item spawnpoints are defined
- each spawnpoint may spawn a randomised item
- guns can be swapped
- damage is proportional of distance and modified by equipped gun
- guns have reload time
- guns have limited ammo

### Menu

- menu and game views can be switched without page reaload
- player is prompted a nickname before entering game

### Visual fx

- receiving damage blinks screen red
- shooting shakes the screen to recoil direction
- obstacles have type and custom sprites
  - wall
  - tree
  - rock

### Audio fx

- sound level declines over distance
- hitting an opponent sounds different than missing

### Assets

- sprites:
  - player
  - wall
  - tree
  - opponent
  - guns and other loot...

### Misc

- GUI displays time to next shrink
- GUI displays current hp
- GUI displays alive players
- player has inventory
  - 2 slots for guns
- items can be looted if there are free slots in inventory
- guns can be dropped and dropping on top of another gun will swap the currently equipped gun
- two guns can be equipped and selected from
- opponents rotate to their facing
- nickname is stored accross sessions in local storage
- create larger map with relevant content

## Maybe?

- audio source direction will change pan
- settings can be configured by players and stored in local storage
- player cannot move to a cell if there's an opponent
- limit shadow update to visible portion of screen

## Done

- rendering is done on layered canvases
  - map and static obstacles are rendered only once
  - players are rendered as html elements and shot fx is rendered as element
  - shadow is renderd on its own canvas including aim
- player movement is transitioned
- Player only sees at the direction of mouse with limited cone of 180 degrees
- WASD movement is rotated along with the facing so that W always moves the player towards the aim direction (up/down/left/right)
- add hosting server
- add socket.io connection between client and server
- game state is stored in a single object
- server keeps track of connected players and removes disconnected players from the tracking
- server tracks game state
- server buffers players' last 10 positions and tracks the # of each step
- client updates server when moving to a new position
- server sends updated game state to all clients in interval
- clients play back remote players' position buffer with reduced move wait time to catch up delayed data
- camera follows player
- draw rectangle around game field to shadow layer
- server shrinks the zone in interval and sends zone size to clients
- a rectangle is displayed around the game field
- bug: long delayed buffer playback does not remaining positions left and needs to jump to first available position in buffer
- parse world from image by reading pixel values
- server has a single method to reset game state
- server generates shuffled index to spawn point index for each player
- server broadcasts setup new game event to all clients to start a new round
- optimization: gather closeby obstacles in the beginning of a tick
- list spawnpoints with positions
- player will spawn at given spawn point received from server as an index
- use html elements for zones to animate shrinks
- refactor: move moveElementTo inside dom object
- player hp is updated based on server state
- client has single method to reset state
- client is able to apply server updates to resetted state
- client updates server when opponent is shot
- player spawnpoints are defined and each player will be randomised to their own spawnpoint
- server updates clients about shots made and discards all shots after the broadcast
- server resets the game state once only one player is alive if there are more than one players connected
- players have hp
