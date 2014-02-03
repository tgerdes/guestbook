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
    console.log("Something pressed " + e);
    if(this.isDown('SPACE')) {
      this.x = Math.floor(Math.random() * Game.map_size.windowWidth);
      if (this.x < 1) this.x = 1;
      if (this.x >= Game.map_size.windowWidth - 1) this.x = Game.map_size.windowWidth - 2;
      this.x = this.x * Game.map_size.tile.width;
      console.log("Space pressed! moved x to" + this.x);
    }
  }
});

