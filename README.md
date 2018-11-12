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

- new game is initted if second player connects
- frags are notified to all players
- server test scored hits and does not apply shots from already dead players
- server keeps track of player that have connected during the game and will show them as observers

#### Client

- waiting for next round is displayed when joining new game

### Gameplay

- dead players will be able to see the whole game field without shadow to observe other players

### Items

- item spawnpoints are defined
- each spawnpoint may spawn a randomised item
- guns can be swapped
- damage is proportional of distance and modified by equipped gun
- guns have reload time
- guns have limited ammo

### Menu

- menu and game views can be switched without page reload
- player is prompted a nickname before entering game

### Visual fx

- obstacles have type and custom sprites
  - wall
  - tree
  - rock

### Audio fx

- audio elements are pooled and recycled for simultaneous and quickly repeated playback
- hitting an opponent sounds different than missing

### Assets

- sprites:
  - player
  - wall
  - tree
  - opponent
  - guns and other loot...

### Misc

- show guide how to play
- optimization: store visibility alpha only for closeby area
- refactor: remove duplicate argument passes with world since world now belongs to state at client
- refactor: move fx into single object
- refactor: remove PROPNAMEs for simplicity and only use EVENT_NAMEs
- player has inventory
  - 2 slots for guns
- items can be looted if there are free slots in inventory
- guns can be dropped and dropping on top of another gun will swap the currently equipped gun
- two guns can be equipped and selected from
- opponents rotate to their facing
- nickname is stored accross sessions in local storage

## Maybe?

- notify who won last game
- audio source direction will change pan
- settings can be configured by players and stored in local storage
- player cannot move to a cell if there's an opponent
- limit shadow update to visible portion of screen
- gun shot damage is determined by how close to the center of the cell is clicked

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
- clicks are determined on click and white square is removed leaving the explosion flash as only marker for position
- client figures out if damage is received by comparing local hp to server update hp
- scoring a hit to a remote player is determined by local player's state of the remote players
- remote players receive damage upon click on them
- GUI displays current hp
- receiving damage blurs screen
- players outside zone will receive damage
- clients remove dead opponents
- shooting shakes the screen
- create larger map with relevant content
- GUI displays time to next shrink
- GUI displays alive players
- opponent shots are played back
- opponent steps are played back
- number of players is notified
- sound level declines over distance
- opponents' shot direction is displayd on map
- idle players are disconnected by server
