// Game scene
// -------------
// Runs the core gameplay loop
Crafty.scene('Game', function() {
  Game.map.init();
  if (Game.constants.tileSet == 0) {
    Crafty.background('#FFFFFF url(assets/floor-tile.png)');
  } else if (Game.constants.tileSet == 1) {
    Crafty.background('#FFFFFF url(assets/floor-tile3.png)');
  }
 
  // Player character, placed at 5, 5 on our grid
  this.player = Crafty.e(Game.map.pc).at(Game.map.startX, Game.map.startY);
  this.player.configure(true);
  Game.map.occupy(this.player.at().x, this.player.at().y, 2, 3);
  var decorations = 0;
  if (Game.map.id == Game.map.count - 1) {
    this.player2 = Crafty.e(Game.map.p2).at(20, 9);
    this.player2.configure(false);
    Game.map.occupy(20, 9, 2, 3);
  }
 
  // Place a wall at every edge that isn't a door
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
        }
        if (y != 0 && y != Game.map_size.windowHeight - 1) {
          wall.rotation = 270;
          wall.shift(0, 64, 0, 0)
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
    if (Math.random() > 0.1) {
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
      if (guestIndex >= Game.guests.total) {
        break;
      }
      guestIndex = guestIndex % Game.guests.files.length; // TODO remove when total is this length
      var guest = Crafty.e('Guest').at(x, y);
      guest.configureGuest(guestIndex);
//       guest.animateMove(-256, false, function() {
//         console.log('Finished animating');
//       });
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
  Crafty.background('#BBBBFF');
  Crafty.e('2D, DOM, Text')
    .text('Congratulations')
    .attr({ x: 0, y: 8, w: Game.getViewWidth() })
    .textFont({'size': '48px'})
    .css($text_css);
  Crafty.e('2D, DOM, Text')
    .text('Andrew & Laura!')
    .attr({ x: 0, y: 72, w: Game.getViewWidth() })
    .textFont({'size': '24px'})
    .css($text_css);
  Crafty.e('2D, DOM, Text')
    .text('From your SoMA friends!')
    .attr({ x: 0, y: 416, w: Game.getViewWidth() })
    .textFont({'size': '24px'})
    .css($text_css);
  Crafty.e('2D, DOM, spr_red_button, Mouse')
    .attr({ x: Game.getViewWidth() / 2 - 128, y: 128 })
    .bind('Click', function() {
      Crafty.scene('PlayerSelect');
    });
    
  var npcCount = 0;
  var animateGuest = function() {
    var guest = Crafty.e('Guest').at(Game.map_size.windowWidth, Game.map_size.windowHeight - 4);
    guest.configureGuest(npcCount++);
    guest.setShouldWalk(false);
    guest.animateMove(-Game.getViewWidth() / 2 - 33, true, function() {
      guest.showText(Game.constants.finaleTextDuration, function() {
        guest.animateMove(-Game.getViewWidth() / 2 - 32, true, function() {
          console.log("destroying guest");
          guest.destroy();
        });
        if (npcCount < Game.guests.files.length) {
          animateGuest();
        }
      });
    });           
  };
  animateGuest();
});

Crafty.scene('PlayerSelect', function() {
  Game.map.startX = Game.constants.initX;
  Game.map.startY = Game.constants.initY;
  Crafty.e('2D, DOM, Text')
    .text('Select your player')
    .attr({ x:0, y:128, w:Game.getViewWidth()})
    .textFont({'size': '28px'})
    .css($text_css);
    
    var player = Crafty.e('Player1')
      .at(8, 8)
      .bind('Click', function() {
        console.log("Clicked 1st char!!");
        Game.map.pc = 'Player1';
        Game.map.p2 = 'Player2';
        Crafty.scene('Game');
      });
    player.configure(false);
    player = Crafty.e('Player2')
      .at(16, 8)
      .bind('Click', function() {
        console.log("Clicked 2nd char!!");
        Game.map.pc = 'Player2';
        Game.map.p2 = 'Player1';
        Crafty.scene('Game');
      });
    player.configure(false);
});
 
// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files
Crafty.scene('Loading', function() {
  // Draw some text for the player to see in case the file
  //  takes a noticeable amount of time to load
  window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
  }, false);
  Crafty.background('#BBBBFF');
  Crafty.e('2D, DOM, Text')
    .text('Loading; please wait...')
    .attr({ x: 0, y: Game.getViewHeight()/2 - 24, w: Game.getViewWidth() })
    .textFont({'size': '24px'})
    .css($text_css);
    
  var wall1, wall2, wall3;
  if (Game.constants.tileSet == 0) {
    wall1 = 'assets/wall-1.png';
    wall2 = 'assets/wall-2.png';
    wall3 = 'assets/wall-3.png';
  } else if (Game.constants.tileSet == 1) {
    wall1 = 'assets/wall-p1.png';
    wall2 = 'assets/wall-p2.png';
    wall3 = 'assets/wall-p3.png';
  }
 
  // Load our sprite map image
  Crafty.load([
      wall1,
      wall2,
      wall3,
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
      'assets/bodyfm_m6.png',
      'assets/hair1.png',
      'assets/andrew2.png',
      'assets/laura.png',
      'assets/redButton.png',
      'assets/hair_short.png',
      'assets/hair_long.png'
      ],
      function() {
        // Once the image is loaded...
        Crafty.sprite(48, 66, 'assets/hair_short.png', {
          spr_hair_short: [0, 0],
        }, 0, 0);
        
        Crafty.sprite(48, 66, 'assets/hair_long.png', {
          spr_hair_long: [0, 0],
        }, 0, 0);
        
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

        Crafty.sprite(48, 96, 'assets/bodyfm_m6.png', {
          spr_guest5:  [0, 0],
        }, 0, 0);
      
        Crafty.sprite(48, 96, 'assets/andrew2.png', {
          spr_player: [0,0],
        }, 0, 0);
      
        Crafty.sprite(48, 96, 'assets/laura.png', {
          spr_player2: [0,0],
        }, 0, 0);
      
        Crafty.sprite(64, 64, wall1, {
          spr_wall_0: [0,0],
        }, 0, 0);
      
        Crafty.sprite(64, 64, wall2, {
          spr_wall_1: [0,0],
        }, 0, 0);
        
        Crafty.sprite(64, 64, wall3, {
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
        
        Crafty.sprite(256, 256, 'assets/redButton.png', {
          spr_red_button: [0,0],
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