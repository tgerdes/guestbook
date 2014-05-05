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
    this.requires('Actor').alpha = 0.45;
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

Crafty.c('Decoration', {
  init: function() {
    this.requires('Actor, Solid');
  },
  
  setDecoration: function(which) {
    this.addComponent('spr_decoration_' + which);
    this.attr({w: 80, h: 60});
  }
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

Crafty.c('MuteText', {
  isMuted: false,
  muteText: "Sound on",
  unmuteText: "Sound off",
  
  init: function() {
    this.requires('2D, Canvas, Color, Text, Mouse')
    .textColor('#000000')
    .textFont({size: '18px'})
    .bind('Click', function() {
      if (!this.isMuted) {
        Crafty.audio.mute();
        this.isMuted = true;
        this.text(this.unmuteText);
        this.color('#999999');
      } else {
        Crafty.audio.unmute();
        this.isMuted = false;
        this.text(this.muteText);
        this.color('#ffffff');
      }
      this.attr({ x: Game.getViewWidth() - 128, y: Game.getViewHeight() - 28, h: 20, w: 80 })
    });
    this.isMuted = Crafty.audio.muted;
    if (this.isMuted) {
      this.text(this.unmuteText);
      this.color('#999999');
    } else {
      this.text(this.muteText);
      this.color('#ffffff');
    }
    this.attr({ x: Game.getViewWidth() - 128, y: Game.getViewHeight() - 28, h: 20, w: 80 })
    this.z = 2;
    Crafty.e('2D, Canvas, Color')
      .color('#000000')
      .attr({ x: this.x - 2, y: this.y - 2, w: this.w + 4, h: this.h + 4});
    console.log('set text to ' + this._text);
  }
});

Crafty.c('VisitedText', {
  init: function() {
    this.requires('2D, Canvas, Text')
      .textColor('#000000')
      .textFont({ size: '18px'})
      .attr({ x: 64, y: Game.getViewHeight() - 28 })
      .z = 2;
  },
  
  updateCount: function() {
    this.text("Talked to " + Game.guests.visited + " / " + Game.getGuestCount() + " guests.");
  }
});

//function GuestText () {
Crafty.c('GuestText', {
  count: 0,
  duration: Game.constants.textDuration,
  cb: null,
  
  init: function() {
    this.requires('2D, DOM, Color, Text')
      .bind('RenderScene', this.onRender)
      .textColor('#000000')
      .textFont({ size: '18px'})
      .color('rgb(255, 255, 255)')
      .css({"text-align": "center"});
      this.visible = false
      this.z = 2;
  },
  
  setTextAndUpdate: function(textStr) {
    this.text(textStr);
    var ctx = Crafty.canvas.context;
    ctx.font = this._fontString();
    var w = ctx.measureText(textStr).width;

    var size = (this._textFont.size || this.defaultSize);
    var h = 1.2 * this._getFontHeight(size);
    
    if (w > 256) {
      w = 256;
      h = 2 * h;
    }
    this.w = w;
    this.h = h;
  },
  
  start: function(duration, cb) {
    if (duration) {
      this.duration = duration;
    }
    this.count = 0;
    this.visible = true;
    this.cb = cb;
  },
  
  onRender: function() {
    if (this.visible) {
      if (this.count >= this.duration) {
        console.log('making text invisible');
        this.visible = false;
        if (this.cb) {
          this.cb();
        }
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
    this.requires('2D, Canvas');
  },
  
  setHair: function(which) {
    var hair;
    if (which < 7) {
      hair = 'spr_hair_short';
    } else {
      hair = 'spr_hair_long';
      which -= 8;
    }
    this.addComponent(hair);
    this.attr({w: 48, h:66});
    this.sprite(0, which);
    // make hair a combined image, pick the correct spot in the image
  }
});

Crafty.c('SelectBar', {
  player: 0,
  p1: null,
  p2: null,
  
  init: function() {
    this.requires('2D, Canvas, spr_selection, Keyboard')
        .bind('KeyDown', this.handleKey);
  },
  
  setPlayers: function(player1, player2) {
    this.p1 = player1;
    this.p2 = player2;
    this.x = player1.x - 8;
    this.y = player1.y + 104;
  },
  
  handleKey: function(e) {
    if (this.isDown('SPACE')) {
      if (this.player == 0) {
        console.log("Clicked 1st char!!");
        Game.map.pc = 'Player1';
        Game.map.p2 = 'Player2';
        Crafty.scene('Game');
      } else {
        console.log("Clicked 2nd char!!");
        Game.map.pc = 'Player2';
        Game.map.p2 = 'Player1';
        Crafty.scene('Game');
      }
    } else if (this.isDown('LEFT_ARROW')) {
      this.player = 0;
      this.x = this.p1.x - 8;
      this.y = this.p1.y + 104;
      console.log('p1 is at ' + this.p1.x + ", " + this.p1.y);
    } else if (this.isDown('RIGHT_ARROW')) {
      this.player = 1;
      this.x = this.p2.x - 8;
      this.y = this.p2.y + 104;
      console.log('p2 is at ' + this.p2.x + ", " + this.p2.y);
    }
  }
});

Crafty.c('Marvin', {
  saying: "I've got this terrible pain in all the diodes down my left side.",
  myText: null,
  renderCount: 0,
  
  init: function() {
    this.requires('Actor, spr_marvin');
    this.myText = Crafty.e('GuestText');
    this.myText.setTextAndUpdate(this.saying);
    this.attach(this.myText);
    var xShift = 0;
    if (this.myText._w > 48) {
      xShift = (this.myText._w - 48) / 2;
    }
    
    this.myText.shift(this.x - xShift, this.y - 24, 0, 0);
    this.bind('RenderScene', this.onRender);
  },
  
  onRender: function() {
    if (this.renderCount % Game.map_size.tile.width == 0) {
      if (Math.random() < 0.01) {
        this.showText();
      }
    }
    this.renderCount++;
  },
  
  showText: function(duration, cb) {
    console.log('showing text ' + this.myText._text + " at " + this.x + ", " + this.y);
    this.myText.start(duration, cb);
  }
});

Crafty.c('Guest', {
  xStart: 0,
  yStart: 0,
  xAnimDist: 0,
  yAnimDist: 0,
  animCb: null,
  xDiff: 0,
  yDiff: 0,
  shouldWalk: true,
  animatingMove: false,
  renderCount: 0,
  bounceCount: 0,
  name: "Steve",
  saying: "Steeeeeve!",
  myText: null,
  myFace: null,
  myHair: null,
  myGuest: null,
  
  init: function() {
    this.requires('Actor, Collision, SpriteAnimation');
  },
  
  configureGuest: function(guestIndex) {
    this.addComponent('spr_guest' + Game.guests.guestViews[guestIndex].body);
    this.bind('RenderScene', this.onRender)
      .stopOnSolids()
      .attr({w: 48, h: 96})
      .reel('GuestDown', 600, 0, 0, 3)
      .reel('GuestRight', 600, 0, 1, 3)
      .reel('GuestLeft', 600, 0, 2, 3)
      .reel('GuestUp', 600, 0, 3, 3);
    this.myGuest = Game.guests.guestViews[guestIndex];
    this.saying = this.myGuest.saying;
    this.myText = Crafty.e('GuestText');
    this.myText.setTextAndUpdate(this.saying);
    this.attach(this.myText);
    
    this.myFace = Crafty.e(Game.guests.sprites[guestIndex]);
    this.myHair = Crafty.e('GuestHair');
    this.myHair.setHair(this.myGuest.hair);
    this.attach(this.myFace);
    this.attach(this.myHair);
    this.myFace.w = 48;
    this.myFace.h = 66;
    
    var xShift = 0;
    if (this.myText._w > 48) {
      xShift = (this.myText._w - 48) / 2;
    }
    
    this.myText.shift(this.x - xShift, this.y - 24, 0, 0);
    this.myFace.shift(this.x, this.y, 0, 0);
    this.myHair.shift(this.x, this.y, 0, 0);
    this.myFace.ready = true;
    this.myFace.trigger("Invalidate");
    this.setAnimation();
    console.log('myFace is ' + this.myFace + ' with image ' + this.myFace.img);
  },
  
  setShouldWalk: function(walk) {
    this.shouldWalk = walk;
  },
  
  onRender: function() {
    if (this.animatingMove) {
      var distX = Math.abs(this.x - this.xStart);
      var distY = Math.abs(this.y - this.yStart);
      if (distX >= this.xAnimDist && distY >= this.yAnimDist) {
        console.log("stopped animation with a dist of " + distX + ", " + distY
            + " and rate of " + this.xDiff + ", " + this.yDiff);
        this.animatingMove = false;
        this.xDiff = 0;
        this.yDiff = 0;
        this.setAnimation();
        if (this.animCb) {
          this.animCb();
        }
        return;
      }
      this.doMove(false);
      return;
    } else if (!this.shouldWalk) {
      return;
    }
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
  
  animateMove: function(dist, isHorizontal, cb) {
    console.log('animateMove called with dist ' + dist + ' horiz? ' + isHorizontal);
    var xDist, yDist;
    if (isHorizontal) {
      xDist = dist;
      yDist = 0;
    } else {
      xDist = 0;
      yDist = dist;
    }
    this.xDiff = 0;
    this.yDiff = 0;
    this.xAnimDist = Math.abs(xDist);
    this.yAnimDist = Math.abs(yDist);
    if (xDist < 0) {
      this.xDiff = -5;
    } else if (xDist > 0) {
      this.xDiff = 1.75;
    } else if (yDist < 0) {
      this.yDiff = -1.75;
    } else if (yDist > 0) {
      this.yDiff = 1.75;
    } else {
      return;
    }
    this.setAnimation();
    this.animatingMove = true;
    this.animCb = cb;
    this.xStart = this.x;
    this.yStart = this.y;
    console.log('Animating move from ' + this.xStart + ", " + this.yStart
      + " a distance of " + this.xAnimDist + ", " + this.yAnimDist);
  },
  
  doMove: function(revert) {
    var diff;
    if (revert) diff = -this.xDiff
    else diff = this.xDiff;
    this.x += diff;
    
    if (revert) diff = -this.yDiff
    else diff = this.yDiff;
    this.y += diff;
    
    if (!this.animatingMove) {
      this.x = Math.max(Game.map_size.tile.width, this.x);
      this.x = Math.min((Game.map_size.windowWidth - 3) * Game.map_size.tile.width, this.x);
      this.y = Math.max(Game.map_size.tile.height, this.y);
      this.y = Math.min((Game.map_size.windowHeight - 4) * Game.map_size.tile.height, this.y);
    }
  },

  stopOnSolids: function() {
    this.onHit('Solid', this.avoidGuest);
    this.onHit('Guest', this.avoidGuest);
    this.onHit('Marvin', this.avoidGuest);
    this.onHit(Game.map.p2, this.avoidGuest);
    this.onHit(Game.map.pc, this.stopMovement);
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
  
  showText: function(duration, cb) {
    console.log('showing text ' + this.myText._text + " at " + this.x + ", " + this.y);
    this.myText.start(duration, cb);
  }
});

Crafty.c('Player1', {
  init: function() {
    this.requires('spr_player, PlayerCharacter')
      .attr({w: 48, h: 96});
  },
});

Crafty.c('Player2', {
  init: function() {
    this.requires('spr_player2, PlayerCharacter')
      .attr({w: 48, h: 96});
  },
});
    
// This is the player-controlled character
Crafty.c('PlayerCharacter', {
  init: function() {
    this.requires('Actor, Fourway, Collision, Keyboard, SpriteAnimation, Mouse');
    this.z = 1;
  },
  
  configure: function(canControl) {
    this.reel('PlayerDown', 800, 1, 0, 2)
      .reel('PlayerRight', 1000, [[0, 1],[1, 1], [0, 1], [2, 1]])
      .reel('PlayerLeft', 1000, [[0, 2],[1, 2], [0, 2], [2, 2]])
      .reel('PlayerUp', 800, 1, 3, 2)
      .reel('PlayerStanding',1000, 0, 0, 1);
    if (canControl) {
      this.fourway(4)
        .stopOnSolids()
        .bind('NewDirection', this.changeDirection)
        .bind('KeyDown', this.handleSpace);
      if (Game.map.lastDir) {
        this.changeDirection(Game.map.lastDir);
      }
    }
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
        if (!guest.myGuest.visited) {
          guest.myGuest.visited = true;
          Game.guests.visited++;
          Game.updateGuestCount();
        }
      } else {
        result = this.hit('PlayerCharacter');
        if (result.length > 0) {
          console.log("Hit pc " + result[0].obj);
          Crafty.scene('Victory');
        } else {
          result = this.hit('Marvin');
          if (result.length > 0) {
            console.log("Hit Marvin, ouch!");
            result[0].obj.showText();
          }
        }
      }
    }
  },
  
  changeDirection: function(data) {
    Game.map.lastDir = data;
    if (data.x > 0) {
        this.animate('PlayerRight', -1);
    } else if (data.x < 0) {
        this.animate('PlayerLeft', -1);
    } else if (data.y > 0) {
        this.animate('PlayerDown', -1);
    } else if (data.y < 0) {
        this.animate('PlayerUp', -1);
    } else {
        this.animate('PlayerStanding', 1);
        //this.pauseAnimation();
    }
  }
});

function GuestView (fileName, saying, body, hair) {
  this.fileName = fileName;
  this.saying = saying;
  this.body = body;
  this.hair = hair;
  this.visited = false;
}