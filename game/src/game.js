// var canvas=document.getElementById('myCanvas');
// var ctx=canvas.getContext('2d');
// ctx.fillStyle='#FFFF00';
// ctx.fillRect(0,0,80,100);

Game = {
  map_size: {
    windowWidth: 24,
    windowHeight: 18,
    width:  64,
    height: 64,
    tile: {
      width:  32,
      height: 32
    }
  },
  
  constants: {
    textDuration: 250,
  },
  
  map: {},
  
  map_position: {
    x: 0,
    y: 0
  },
  
  
  getWidth: function() {
    return Game.map_size.width * Game.map_size.tile.width;
  },
  
  getHeight: function() {
    return Game.map_size.height * Game.map_size.tile.height;
  },
  
  getViewWidth: function() {
    return Game.map_size.windowWidth * Game.map_size.tile.width;
  },
  
  getViewHeight: function() {
    return Game.map_size.windowHeight * Game.map_size.tile.height;
  },
  
  // Initialize and start our game
  start: function() {
    Game.map = new Array();
    for (var x = 0; x < Game.map_size.width; x++) {
      Game.map[x] = new Array();
      for (var y = 0; y < Game.map_size.height; y++) {
        Game.map[x][y] = 'rgb(0,200,260)';
      }
    }
    // Start crafty and set a background color so that we can see it's working
    Crafty.init(Game.getViewWidth(), Game.getViewHeight());
    Crafty.background('rgb(155,185,22)');
    
    // Place a tree at every edge square on our grid of 16x16 tiles
    for (var x = 0; x < Game.map_size.width; x++) {
      for (var y = 0; y < Game.map_size.height; y++) {
        var at_edge = x == 0 || x == Game.map_size.windowWidth - 1 || y == 0 || y == Game.map_size.windowHeight - 1;
 
        if (at_edge) {
          Crafty.e('Tree').at(x, y);
        } else if (Math.random() < 0.06) {
          Crafty.e('Bush').at(x, y);
        }
      }
    }
    Crafty.e("PlayerCharacter").at(5, 5);
    Crafty.e("Guest").at(7,3);
    Crafty.e("Guest").at(1,1);
    Crafty.e("Guest").at(5,8);
    Crafty.e("Guest").at(2,2);
  }
}