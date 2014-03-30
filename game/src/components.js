// The Grid component allows an element to be located
//  on a grid of tiles
Crafty.c('Grid', {
  init: function() {
    this.attr({
      w: Game.map_size.tile.width,
      h: Game.map_size.tile.height
    })
  },
 
  // Locate this entity at the given position on the grid
  at: function(x, y) {
    if (x === undefined && y === undefined) {
      return { x: this.x/Game.map_size.tile.width, y: this.y/Game.map_size.tile.height }
    } else {
      this.attr({ x: x * Game.map_size.tile.width, y: y * Game.map_size.tile.height });
      return this;
    }
  }
});
 
// An "Actor" is an entity that is drawn in 2D on canvas
//  via our logical coordinate grid
Crafty.c('Actor', {
  init: function() {
    this.requires('2D, Canvas, Grid');
  },
});

Crafty.c('Door', {
  init: function() {
    this.requires('Actor').alpha = 0.12;
  },
  
  direction: function(right) {
    if (right) {
      this.addComponent('spr_arrow_right');
    } else {
      this.addComponent('spr_arrow_left')
    }
    this.attr({w: 32, h: 192});
  }
});

// A Tree is just an Actor with a certain color
Crafty.c('Wall', {
  init: function() {
    this.requires('Actor, Solid');
  },
  
  setWall: function(which) {
    this.addComponent('spr_wall_' + which);
    this.attr({w: 64, h: 64});
  },
});

// A Tree is just an Actor with a certain color
Crafty.c('Window', {
  init: function() {
    this.requires('Actor, Solid, spr_window_a')
      .attr({w: 256, h: 64});
  },
});

// A Tree is just an Actor with a certain color
Crafty.c('WindowB', {
  init: function() {
    this.requires('Actor, Solid, spr_window_b')
      .attr({w: 256, h: 64});
  },
});

//function GuestText () {
Crafty.c('GuestText', {
  count: 0,
  
  init: function() {
    this.requires('2D, Canvas, Color, Text')
      .bind('RenderScene', this.onRender)
      .textColor('#000000')
      .textFont({ size: '18px'})
      .color('rgb(255, 255, 255)');
      this.visible = false
      this.z = 2;
  },
  
  start: function() {
    this.count = 0;
    this.visible = true;
  },
  
  onRender: function() {
    if (this.visible) {
      if (this.count >= Game.constants.textDuration) {
        console.log('making text invisible');
        this.visible = false;
      }
      this.count++;
    }
  },
});

Crafty.c('GuestFace', {
  init: function() {
    this.requires('2D, Canvas, Sprite');
  }
});

Crafty.c('GuestHair', {
  init: function() {
    this.requires('2D, Canvas, spr_hair1');
  },
  
  setHair: function(which) {
    // make hair a combined image, pick the correct spot in the image
  }
});

Crafty.c('Guest', {
  xDiff: 0,
  yDiff: 0,
  renderCount: 0,
  bounceCount: 0,
  name: "Steve",
  saying: "Steeeeeve!",
  myText: null,
  myFace: null,
  myHair: null,
  
  init: function() {
    var bodyIndex = Game.guests.count++ % 5;
    this.requires('Actor, Collision, SpriteAnimation, spr_guest' + bodyIndex)
      .bind('RenderScene', this.onRender)
      .stopOnSolids()
      .attr({w: 48, h: 96})
      .reel('GuestDown', 600, 0, 0, 3)
      .reel('GuestRight', 600, 0, 1, 3)
      .reel('GuestLeft', 600, 0, 2, 3)
      .reel('GuestUp', 600, 0, 3, 3);
    var faceIndex = Game.guests.count++ % Game.guests.files.length;
    this.saying = Game.guests.sayings[faceIndex];
    this.myText = Crafty.e('GuestText');
    this.myText.text(this.saying);
    this.attach(this.myText);
    this.myText.shift(0, -24, 0, 0);
    this.myFace = Crafty.e('GuestFace');
    
    this.myFace = Crafty.e('face' + faceIndex);
    this.myHair = Crafty.e('GuestHair');
    this.attach(this.myFace);
    this.attach(this.myHair);
    this.myFace.w = 48;
    this.myFace.h = 66;
    this.myFace.ready = true;
    this.myFace.trigger("Invalidate");
    console.log('myFace is ' + this.myFace + ' with image ' + this.myFace.img);
  },
  
  onRender: function() {
    if (this.renderCount % Game.map_size.tile.width == 0) {
      this.bounceCount = 0;
      
      var result = this.hit('PlayerCharacter');
      if (!result) {
        var dir = Math.random() > 0.5;
        if (dir) {
          this.xDiff = (Math.random() * 3);
          if (this.xDiff > 2.8) {
            this.xDiff = 1;
          } else if (this.xDiff > 0.2) {
            this.xDiff = 0;
          } else {
            this.xDiff = -1;
          }
          this.yDiff = 0;
        } else {
          this.yDiff = (Math.random() * 3);
          if (this.yDiff > 2.8) {
            this.yDiff = 1;
          } else if (this.yDiff > 0.2) {
            this.yDiff = 0;
          } else {
            this.yDiff = -1;
          }
          this.xDiff = 0;
        }
        this.setAnimation();
      }
      if (Math.random() < 0.01) {
        this.showText();
      }
    }
    
    this.renderCount++;
    this.doMove(false);
//     this.myText.attr({ x: this.x, y: this.y - Game.map_size.tile.height / 2 });
  },
  
  doMove: function(revert) {
    var diff;
    if (revert) diff = -this.xDiff
    else diff = this.xDiff;
    this.x = Math.max(Game.map_size.tile.width, this.x + diff);
    this.x = Math.min((Game.map_size.windowWidth - 3) * Game.map_size.tile.width, this.x);
    if (revert) diff = -this.yDiff
    else diff = this.yDiff;
    this.y = Math.max(Game.map_size.tile.height, this.y + diff);
    this.y = Math.min((Game.map_size.windowHeight - 4) * Game.map_size.tile.height, this.y);
  },

  stopOnSolids: function() {
    this.onHit('Solid', this.avoidGuest);
    this.onHit('Guest', this.avoidGuest);
    this.onHit('PlayerCharacter', this.stopMovement);
    return this;
  },
 
  // Stops the movement
  stopMovement: function() {
    this.doMove(true);
    this.xDiff = 0;
    this.yDiff = 0;
    this.setAnimation();
  },
  
  avoidGuest: function() {
    this.doMove(true);
    if (this.bounceCount > 1) {
      this.xDiff = 0;
      this.yDiff = 0;
    } else {
      this.xDiff = -this.xDiff;
      this.yDiff = -this.yDiff;
      this.bounceCount++;
    }
    this.setAnimation();
  },
  
  setAnimation: function() {
    var isUp = false;
    if (this.xDiff > 0) {
      this.animate('GuestRight', -1);
    } else if (this.xDiff < 0) {
      this.animate('GuestLeft', -1);
    } else if (this.yDiff > 0) {
      this.animate('GuestDown', -1);
    } else if (this.yDiff < 0) {
      this.animate('GuestUp', -1);
      isUp = true;
    } else {
      this.animate('GuestDown', 0);
      this.pauseAnimation();
    }
    if (isUp) {
      this.myFace.visible = false;
      this.myHair.visible = true;
    } else {
      this.myFace.visible = true;
      this.myHair.visible = false;
    }
  },
  
  showText: function() {
    console.log('showing text ' + this.myText._text + " at " + this.x + ", " + this.y);
    this.myText.start();
  }
});
    
// This is the player-controlled character
Crafty.c('PlayerCharacter', {
  init: function() {
    this.requires('Actor, Fourway, spr_player, Collision, Keyboard, SpriteAnimation')
      .fourway(4)
      .stopOnSolids()
      .reel('PlayerUp', 600, 0, 0, 3)
      .reel('PlayerRight', 600, 0, 1, 3)
      .reel('PlayerDown', 600, 0, 2, 3)
      .reel('PlayerLeft', 600, 0, 3, 3)
      .bind('NewDirection', this.changeDirection)
      .bind('KeyDown', this.handleSpace);
    this.z = 1;
  },
  
  // Registers a stop-movement function to be called when
  //  this entity hits an entity with the "Solid" component
  stopOnSolids: function() {
    this.onHit('Solid', this.stopMovement);
    this.onHit('Door', this.changeScene);
    return this;
  },
 
  // Stops the movement
  stopMovement: function() {
    console.log("Stopping movement");
    this._speed = 0;
    if (this._movement) {
      this.x -= this._movement.x;
      this.y -= this._movement.y;
    }
  },
  
  changeScene: function() {
    if (this.x > Game.getViewWidth() / 2) {
      Game.map.id++;
      Game.map.startX = 2;
    } else {
      Game.map.id--;
      Game.map.startX = Game.map_size.windowWidth - 3;
    }
    Game.map.startY = this.at().y;
    console.log("Restarting with map id " + Game.map.id);
    Crafty.scene('Game');
  },
  
  handleSpace: function(e) {
    if(this.isDown('SPACE')) {
      var result = this.hit('Guest');
      if (result.length > 0) {
        var guest = result[0].obj;
        console.log("Hitting guest " + guest.name);
        guest.showText();
      }
    }
  },
  
  changeDirection: function(data) {
    if (data.x > 0) {
        this.animate('PlayerRight', -1);
    } else if (data.x < 0) {
        this.animate('PlayerLeft', -1);
    } else if (data.y > 0) {
        this.animate('PlayerDown', -1);
    } else if (data.y < 0) {
        this.animate('PlayerUp', -1);
    } else {
        this.pauseAnimation();
    }
  }
});

