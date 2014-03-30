// Game scene
// -------------
// Runs the core gameplay loop
Crafty.scene('Game', function() {
  Game.map.init();
  Crafty.background('#FFFFFF url(assets/floor-tile.png)');
 
  // Player character, placed at 5, 5 on our grid
  this.player = Crafty.e('PlayerCharacter').at(Game.map.startX, Game.map.startY);
  Game.map.occupy(this.player.at().x, this.player.at().y, 1, 1);
  var decorations = 0;
 
  // Place a tree at every edge square on our grid of 16x16 tiles
  for (var x = 0; x <Game.map_size.windowWidth; x += 2) {
    for (var y = 0; y < Game.map_size.windowHeight; y += 2) {
      var at_edge = x == 0 || x == Game.map_size.windowWidth - 1 || y == 0 || y == Game.map_size.windowHeight - 1;
      var at_door = (y >= Game.map.door - 2 && y <= Game.map.door + 2 ) && ((x == 0 && Game.map.id > 0)
          || (x == Game.map_size.windowWidth - 1 && Game.map.id < Game.map.count));
      var can_decorate = (x == 0 || y == 0) && !(y == 0 && x == 0)
          && x != Game.map_size.windowWidth - 1 && y != Game.map_size.windowHeight - 1;
 
      if (at_edge && !at_door) {
        var wall = Crafty.e('Wall').at(x, y);
        // Place a wall entity at the current tile
        if (!can_decorate || decorations > 3 || Math.random() > 0.1) {
          wall.setWall(0);
        } else {
          var decor = Math.random() * 2;
          var wall;
          if (decor > 1) {
            wall.setWall(1);
          } else {
            wall.setWall(2);
          }
          if (y != 0) {
            wall.rotation = 270;
            wall.shift(0, 64, 0, 0)
          }
        }
        Game.map.occupy(x, y, 2, 2);
      }
    }
    if (Game.map.id < Game.map.count) {
      Crafty.e('Door').at(Game.map_size.windowWidth - 1, Game.map.door - 2).direction(true);
    }
    if (Game.map.id > 0) {
      Crafty.e('Door').at(0, Game.map.door - 2).direction(false);
    }
    if (Math.random() > 0.05) {
      Crafty.e('Window').at(10, 0);
    } else {
      Crafty.e('WindowB').at(10,0);
    }
    Crafty.e('Wall').at(0, 0).setWall(3);
    Crafty.e('Wall').at(0, Game.map_size.windowHeight - 1).setWall(5);
    Crafty.e('Wall').at(Game.map_size.windowWidth - 1, 0).setWall(4);
    Crafty.e('Wall').at(Game.map_size.windowWidth - 1, Game.map_size.windowHeight - 1).setWall(3);
    
  }
 
  // Generate up to 10 NPCs on the map in random locations
  var max_npcs = 10;
  for (var x = 2; x < Game.map_size.windowWidth - 3; x++) {
    for (var y = 2; y < Game.map_size.windowHeight - 3; y++) {
      if (Math.random() < 0.06) {
        var occupied = Game.map.isOccupied(x, y) || Game.map.isOccupied(x, y+1) || Game.map.isOccupied(x, y+2);
        if (Crafty('Guest').length < max_npcs && !occupied) {
          Crafty.e('Guest').at(x, y);
          Game.map.occupy(x, y, 2, 3);
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
        'assets/wall-1.png',
        'assets/wall-2.png',
        'assets/wall-3.png',
        'assets/corner.png',
        'assets/corner-small.png',
        'assets/corner-small2.png',
        'assets/window-1.png',
        'assets/window-2.png',
        'assets/arrows-left.png',
        'assets/arrows-right.png',
        'assets/dante_0_0.png',
        'assets/body_m1.png',
        'assets/hair1.png',
        Game.guests.files[0],
        Game.guests.files[1]
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

    Crafty.sprite(48, 96, 'assets/body_m1.png', {
      spr_guest:  [0, 0],
    }, 0, 0);

    Crafty.sprite(48, 96, 'assets/andrew.png', {
      spr_player: [0,0],
    }, 0, 0);

    Crafty.sprite(64, 64, 'assets/floor-1.png', {
      spr_floor: [0,0],
    }, 0, 0);

    Crafty.sprite(64, 64, 'assets/wall-1.png', {
      spr_wall_0: [0,0],
    }, 0, 0);

    Crafty.sprite(64, 64, 'assets/wall-2.png', {
      spr_wall_1: [0,0],
    }, 0, 0);
    
    Crafty.sprite(64, 64, 'assets/wall-3.png', {
      spr_wall_2: [0,0],
    }, 0, 0);

    Crafty.sprite(64, 64, 'assets/corner.png', {
      spr_wall_3: [0,0],
    }, 0, 0);

    Crafty.sprite(64, 64, 'assets/corner-small.png', {
      spr_wall_4: [0,0],
    }, 0, 0);

    Crafty.sprite(64, 64, 'assets/corner-small2.png', {
      spr_wall_5: [0,0],
    }, 0, 0);
    
    Crafty.sprite(256, 64, 'assets/window-1.png', {
      spr_window_b: [0,0],
    }, 0, 0);

    Crafty.sprite(256, 64, 'assets/window-2.png', {
      spr_window_a: [0,0],
    }, 0, 0);

    Crafty.sprite(64, 256, 'assets/arrows-left.png', {
      spr_arrow_left: [0,0],
    }, 0, 0);
    
    Crafty.sprite(48, 66, 'assets/hair1.png', {
      spr_hair1: [0,0],
    }, 0, 0);

    Crafty.sprite(64, 256, 'assets/arrows-right.png', {
      spr_arrow_right: [0,0],
    }, 0, 0);
    
    for (var i = 0; i < Game.guests.files.length; i++) {
      Crafty.face('FaceSprite' + i, Game.guests.files[i]);
      Crafty.c('face' + i, {
        myId: i,
        init: function() {
          this.requires('2D, Canvas, FaceSprite' + this.myId);
          console.log('Initializing face' + this.myId);
        }
      });
    }
    // Now that our sprites are ready to draw, start the game
    Crafty.scene('Game');
  });
 
});