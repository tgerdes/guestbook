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
      return { x: this.x/Game.map_grid.tile.width, y: this.y/Game.map_grid.tile.height }
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
 
// A Tree is just an Actor with a certain color
Crafty.c('Tree', {
  init: function() {
    this.requires('Actor, Color, Solid')
      .color('rgb(20, 125, 40)');
  },
});
 
// A Bush is just an Actor with a certain color
Crafty.c('Bush', {
  init: function() {
    this.requires('Actor, Color')
      .color('rgb(20, 185, 40)');
  },
});

//function GuestText () {
Crafty.c('GuestText', {
  count: 0,
  
  init: function() {
    this.requires('2D, Canvas, Text')
      .bind('RenderScene', this.onRender)
      .textColor('#FFFFFF');
      this.visible = false
  },
  
  start: function() {
    this.count = 0;
    this.visible = true;
  },
  
  onRender: function() {
    if (!this.visible) {
      return;
    }
    if (this.count >= Game.constants.textDuration) {
      console.log('making text invisible');
      this.visible = false;
    }
    this.count++;
  },
});

Crafty.c('Guest', {
  xDiff: 0,
  yDiff: 0,
  renderCount: 0,
  name: "Steve",
  saying: "Steeeeeve!",
  myText: null,
  
  init: function() {
    this.requires('Actor, Color, Collision')
      .color('rgb(180, 35, 35)')
      .bind('RenderScene', this.onRender)
      .stopOnSolids();
    this.myText = Crafty.e('GuestText');
    this.myText.text(this.saying);
    this.attach(this.myText);
    this.myText.shift(0, -16, 0, 0);
  },
  
  onRender: function() {
    if (this.renderCount % Game.map_size.tile.width == 0) {
      var dir = Math.random() > 0.5;
      if (dir) {
        this.xDiff = (Math.random() * 3);
        if (this.xDiff > 2.8) this.xDiff = 1;
        else if (this.xDiff > 0.2) this.xDiff = 0;
        else this.xDiff = -1;
        this.yDiff = 0;
      } else {
        this.yDiff = (Math.random() * 3);
        if (this.yDiff > 2.8) this.yDiff = 1;
        else if (this.yDiff > 0.2) this.yDiff = 0;
        else this.yDiff = -1;
        this.xDiff = 0;
      }
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
  },
  
  showText: function() {
    console.log('showing text ' + this.myText.text + " at " + this.x + ", " + this.y);
    this.myText.start();
  }
})
    
// This is the player-controlled character
Crafty.c('PlayerCharacter', {
  init: function() {
    this.requires('Actor, Fourway, Color, Collision, Keyboard')
      .fourway(4)
      .color('rgb(20, 75, 40)')
      .stopOnSolids()
      .bind('KeyDown', this.handleSpace);
  },
  
  // Registers a stop-movement function to be called when
  //  this entity hits an entity with the "Solid" component
  stopOnSolids: function() {
    this.onHit('Solid', this.stopMovement);
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
  
  handleSpace: function(e) {
    if(this.isDown('SPACE')) {
      var result = this.hit('Guest');
      if (result.length > 0) {
        var guest = result[0].obj;
        console.log("Hitting guest " + guest.name);
        guest.showText();
      }
    }
  }
});

