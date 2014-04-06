// Game scene
// -------------
// Runs the core gameplay loop
Crafty.scene('Game', function() {
  Game.map.init();
  Crafty.background('#FFFFFF url(assets/floor-tile.png)');
 
  // Player character, placed at 5, 5 on our grid
  this.player = Crafty.e(Game.map.pc).at(Game.map.startX, Game.map.startY);
  Game.map.occupy(this.player.at().x, this.player.at().y, 2, 3);
  var decorations = 0;
 
  // Place a tree at every edge square on our grid of 16x16 tiles
  for (var x = 0; x <Game.map_size.windowWidth; x += 2) {
    for (var y = 0; y < Game.map_size.windowHeight; y += 2) {
      var at_edge = x == 0 || x == Game.map_size.windowWidth - 1 || y == 0 || y == Game.map_size.windowHeight - 1;
      var at_door = (y >= Game.map.door - 2 && y <= Game.map.door + 2 ) && ((x == 0 && Game.map.id > 0)
          || (x == Game.map_size.windowWidth - 1 && Game.map.id < Game.map.count - 1));
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
 
  // Generate NPCs on the map in random locations
  var guestCount = 0;
  while (guestCount < Game.constants.guestsPerRoom) {
    var x = Math.floor(Math.random() * (Game.map_size.windowWidth - 5)) + 2;
    var y = Math.floor(Math.random() * (Game.map_size.windowHeight - 5)) + 2;
    console.log('Checking occupancy of ' + x + ', ' + y);
    if (!Game.map.isOccupied(x, y, 2, 3)) {
      var guestIndex = Game.map.id * Game.constants.guestsPerRoom + guestCount;
      if (guestIndex > Game.guests.total) {
        break;
      }
      guestIndex = guestIndex % Game.guests.files.length; // TODO remove when total is this length
      Crafty.e('Guest').at(x, y).configureGuest(guestIndex);
      Game.map.occupy(x, y, 2, 3);
      guestCount++;
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

Crafty.scene('PlayerSelect', function() {
  Crafty.e('2D, DOM, Text')
    .text('Select your player')
    .attr({ x:0, y:128, w:Game.getViewWidth()})
    .textFont({'size': '24px'})
    .css($text_css);
    
    Crafty.e('Player1')
      .at(8, 8)
      .bind('Click', function() {
        console.log("Clicked 1st char!!");
        Game.map.pc = 'Player1';
        Crafty.scene('Game');
      });
    Crafty.e('Player2')
      .at(16, 8)
      .bind('Click', function() {
        console.log("Clicked 2nd char!!");
        Game.map.pc = 'Player2';
        Crafty.scene('Game');
      });
});
 
// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files
Crafty.scene('Loading', function() {
  // Draw some text for the player to see in case the file
  //  takes a noticeable amount of time to load
  Crafty.e('2D, DOM, Text')
    .text('Loading; please wait...')
    .attr({ x: 0, y: Game.getViewHeight()/2 - 24, w: Game.getViewWidth() })
    .textFont({'size': '24px'})
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
      'assets/body_m1.png',
      'assets/body_m2.png',
      'assets/body_m3.png',
      'assets/body_m4.png',
      'assets/body_m5.png',
      'assets/hair1.png',
      'assets/andrew.png',
      'assets/player2.png'
      ],
      function() {
        // Once the image is loaded...
        
        Crafty.sprite(48, 96, 'assets/body_m1.png', {
          spr_guest0:  [0, 0],
        }, 0, 0);
      
        Crafty.sprite(48, 96, 'assets/body_m2.png', {
          spr_guest1:  [0, 0],
        }, 0, 0);
      
        Crafty.sprite(48, 96, 'assets/body_m3.png', {
          spr_guest2:  [0, 0],
        }, 0, 0);
      
        Crafty.sprite(48, 96, 'assets/body_m4.png', {
          spr_guest3:  [0, 0],
        }, 0, 0);
      
        Crafty.sprite(48, 96, 'assets/body_m5.png', {
          spr_guest4:  [0, 0],
        }, 0, 0);
      
        Crafty.sprite(48, 96, 'assets/andrew.png', {
          spr_player: [0,0],
        }, 0, 0);
      
        Crafty.sprite(48, 96, 'assets/player2.png', {
          spr_player2: [0,0],
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
          var spriteName = 'face' + i;
          Crafty.face('FaceSprite' + i, Game.guests.files[i]);
          Crafty.c(spriteName, {
            myId: i,
            init: function() {
              this.requires('2D, Canvas, FaceSprite' + this.myId);
              console.log('Initializing face' + this.myId);
            }
          });
          Game.guests.sprites[i] = spriteName;
        }
        // Now that our sprites are ready to draw, start the game
        Crafty.scene('PlayerSelect');
      });
});