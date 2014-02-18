// Game scene
// -------------
// Runs the core gameplay loop
Crafty.scene('Game', function() {
  // A 2D array to keep track of all occupied tiles
  this.occupied = new Array(Game.map_size.windowWidth);
  for (var i = 0; i < Game.map_size.windowWidth; i++) {
    this.occupied[i] = new Array(Game.map_size.windowHeight);
    for (var y = 0; y < Game.map_size.windowHeight; y++) {
      this.occupied[i][y] = false;
    }
  }
 
  // Player character, placed at 5, 5 on our grid
  this.player = Crafty.e('PlayerCharacter').at(Game.map.startX, Game.map.startY);
  this.occupied[this.player.at().x][this.player.at().y] = true;
 
  // Place a tree at every edge square on our grid of 16x16 tiles
  for (var x = 0; x <Game.map_size.windowWidth; x++) {
    for (var y = 0; y < Game.map_size.windowHeight; y++) {
      var at_edge = x == 0 || x == Game.map_size.windowWidth - 1 || y == 0 || y == Game.map_size.windowHeight - 1;
      var at_door = (y == Game.map.door || y == Game.map.door + 1)
            && ((x == 0 && Game.map.id > 0) 
            || (x == Game.map_size.windowWidth - 1 && Game.map.id < Game.map.count));
 
      if (at_edge) {
        if (at_door) {
          Crafty.e('Door').at(x + 0.5, y);
        } else {
          // Place a tree entity at the current tile
          Crafty.e('Tree').at(x, y);
          this.occupied[x][y] = true;
        }
      } else if (Math.random() < 0.06 && !this.occupied[x][y]) {
        // Place a bush entity at the current tile
        Crafty.e('Bush').at(x, y);
        this.occupied[x][y] = true;
      }
    }
  }
 
  // Generate up to 10 NPCs on the map in random locations
  var max_npcs = 10;
  for (var x = 0; x < Game.map_size.windowWidth; x++) {
    for (var y = 0; y < Game.map_size.windowHeight; y++) {
      if (Math.random() < 0.02) {
        if (Crafty('Guest').length < max_npcs && !this.occupied[x][y]) {
          Crafty.e('Guest').at(x, y);
        }
      }
    }
  }
}, function() {
});
 
 
// Victory scene
// -------------
// Tells the player when they've won and lets them start a new game
Crafty.scene('Victory', function() {
  // Display some text in celebration of the victory
  Crafty.e('2D, DOM, Text')
    .attr({ x: 0, y: 0 })
    .text('Victory!');
 
  // Watch for the player to press a key, then restart the game
  //  when a key is pressed
  this.restart_game = this.bind('KeyDown', function() {
    Crafty.scene('Game');
  });
}, function() {
  // Remove our event binding from above so that we don't
  //  end up having multiple redundant event watchers after
  //  multiple restarts of the game
  this.unbind('KeyDown', this.restart_game);
});
 
// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files
Crafty.scene('Loading', function(){
  // Draw some text for the player to see in case the file
  //  takes a noticeable amount of time to load
  Crafty.e('2D, DOM, Text')
    .text('Loading; please wait...')
    .attr({ x: 0, y: Game.getViewHeight()/2 - 24, w: Game.getViewWidth() })
    .textFont({ 'size': '24px'})
    .css($text_css);
 
  // Load our sprite map image
  Crafty.load([
        'assets/16x16_forest_2.gif',
        'assets/dante_0_0.png',
        'assets/hunter.png'
        ], function(){
    // Once the image is loaded...
 
    // Define the individual sprites in the image
    // Each one (spr_tree, etc.) becomes a component
    // These components' names are prefixed with "spr_"
    //  to remind us that they simply cause the entity
    //  to be drawn with a certain sprite
    Crafty.sprite(16, 'assets/16x16_forest_2.gif', {
      spr_tree:    [0, 0],
      spr_bush:    [1, 0],
      spr_village: [0, 1],
    });
    
    Crafty.sprite(16, 'assets/hunter.png', {
      spr_guest:  [0, 2],
    }, 0, 2);
    
    Crafty.sprite(32, 32, 'assets/dante_0_0.png', {
      spr_player: [0,0],
    }, 0, 1);
    // Now that our sprites are ready to draw, start the game
    Crafty.scene('Game');
  });
 
});