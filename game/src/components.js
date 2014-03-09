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
    this.requires('Actor')
      .attr({w: 16, h: 32});
  }
})
 
// A Tree is just an Actor with a certain color
Crafty.c('Tree', {
  init: function() {
    this.requires('Actor, Solid, spr_tree')
      .attr({w: 32, h: 32});
  },
});
 
// A Bush is just an Actor with a certain color
Crafty.c('Bush', {
  init: function() {
    this.requires('Actor, spr_bush')
      .attr({w: 32, h: 32});
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

Crafty.c('Guest', {
  xDiff: 0,
  yDiff: 0,
  renderCount: 0,
  name: "Steve",
  saying: "Steeeeeve!",
  myText: null,
  myFace: null,
  
  init: function() {
    this.requires('Actor, Collision, spr_guest, SpriteAnimation')
      .bind('RenderScene', this.onRender)
      .stopOnSolids()
      .attr({w: 48, h: 96})
      .reel('GuestUp', 600, 0, 0, 3)
      .reel('GuestRight', 600, 0, 1, 3)
      .reel('GuestDown', 600, 0, 2, 3)
      .reel('GuestLeft', 600, 0, 3, 3);
    this.myText = Crafty.e('GuestText');
    this.myText.text(this.saying);
    this.attach(this.myText);
    this.myText.shift(0, -24, 0, 0);
    this.myFace = Crafty.e('GuestFace');
    
    var faceIndex = Game.guests.count++ % Game.guests.files.length;
//     var faceImage = Crafty.asset(Game.guests.files[faceIndex]);
//     var faceImage = Crafty.e('2D, Canvas, Image').image(Game.guests.files[faceIndex]);
//     this.myFace.img = faceImage; //Game.guests.sprites[Game.guests.count++ % Game.guests.files.length];
//     this.myFace.attr({w:42, h:60});
    this.myFace = Crafty.e('face' + faceIndex);
    this.attach(this.myFace);
    this.myFace.w = 48;
    this.myFace.h = 66;
    this.myFace.shift(0, -6, 0, 0);
    this.myFace.ready = true;
    this.myFace.trigger("Invalidate");
    console.log('myFace is ' + this.myFace + ' with image ' + this.myFace.img);
  },
  
  onRender: function() {
    if (this.renderCount % Game.map_size.tile.width == 0) {
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
    
    this.renderCount++;
    this.x = Math.max(Game.map_size.tile.width, this.x + this.xDiff);
    this.x = Math.min((Game.map_size.windowWidth - 2) * Game.map_size.tile.width, this.x);
    this.y = Math.max(Game.map_size.tile.height, this.y + this.yDiff);
    this.y = Math.min((Game.map_size.windowHeight - 2) * Game.map_size.tile.height, this.y);
    
//     this.myText.attr({ x: this.x, y: this.y - Game.map_size.tile.height / 2 });
  },

  stopOnSolids: function() {
    this.onHit('Solid', this.stopMovement);
    this.onHit('Guest', this.avoidGuest);
    this.onHit('PlayerCharacter', this.stopMovement);
    return this;
  },
 
  // Stops the movement
  stopMovement: function() {
    this.xDiff = 0;
    this.yDiff = 0;
  },
  
  avoidGuest: function() {
    this.xDiff = -this.xDiff;
    this.yDiff = -this.yDiff;
    this.setAnimation();
  },
  
  setAnimation: function() {
    if (this.xDiff > 0) {
      this.animate('GuestRight', -1);
    } else if (this.xDiff < 0) {
      this.animate('GuestLeft', -1);
    } else if (this.yDiff > 0) {
      this.animate('GuestDown', -1);
    } else if (this.yDiff < 0) {
      this.animate('GuestUp', -1);
    } else {
      this.pauseAnimation();
    }
  },
  
  showText: function() {
    console.log('showing text ' + this.myText._text + " at " + this.x + ", " + this.y);
    this.myText.start();
  }
})
    
// This is the player-controlled character
Crafty.c('PlayerCharacter', {
  init: function() {
    this.requires('Actor, Fourway, spr_player, Collision, Keyboard, SpriteAnimation')
      .fourway(4)
      .stopOnSolids()
      .reel('PlayerUp', 600, [[2,0], [2,1], [2,2], [2,3]])
      .reel('PlayerRight', 600, [[3,0], [3,1], [3,2], [3,3]])
      .reel('PlayerDown', 600, [[0,0], [0,1], [0,2], [0,3]])
      .reel('PlayerLeft', 600, [[1,0], [1,1], [1,2], [1,3]])
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
      Game.map.startX = 1;
    } else {
      Game.map.id--;
      Game.map.startX = Game.map_size.windowWidth - 2;
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

