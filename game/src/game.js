// var canvas=document.getElementById('myCanvas');
// var ctx=canvas.getContext('2d');
// ctx.fillStyle='#FFFF00';
// ctx.fillRect(0,0,80,100);

Game = {
  map_size: {
    windowWidth: 32,
    windowHeight: 24,
    width:  64,
    height: 64,
    tile: {
      width:  32,
      height: 32
    }
  },
  
  map: {},
  
  map_position: {
    x: 0,
    y: 0
  },
  
  getWidth: function() {
    return Game.map_size.windowWidth * Game.map_size.tile.width;
  },
  
  getHeight: function() {
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
    Crafty.init(Game.getWidth(), Game.getHeight());
    Crafty.background('rgb(155,185,22)');
    // Place a tree at every edge square on our grid of 16x16 tiles
    for (var x = 0; x < Game.map_size.width; x++) {
      for (var y = 0; y < Game.map_size.height; y++) {
        var at_edge = x == 0 || x == Game.map_size.width - 1 || y == 0 || y == Game.map_size.height - 1;
 
        if (at_edge) {
          Game.map[x][y] = 'rgb(20, 125, 40)';
        } else if (Math.random() < 0.06) {
          Game.map[x][y] = 'rgb(20, 185, 40)';
        }
      }
    }
    Game.drawMap();
  
    document.onkeydown = function(e) {
      e = e || window.event;
      var update = false;
      if(e.key == Crafty.keys['LEFT_ARROW']) {
        Game.map_position.x = Math.max(0, Game.map_position.x - 1);
        update = true;
      } else if (e.key == Crafty.keys['RIGHT_ARROW']) {
        Game.map_position.x = Math.min(Game.map_size.width - Game.map_size.windowWidth, Game.map_position.x + 1);
        update = true;
      } else if (e.key == Crafty.keys['UP_ARROW']) {
        Game.map_position.y = Math.max(0, Game.map_position.y - 1);
        update = true;
      } else if (e.key == Crafty.keys['DOWN_ARROW']) {
        Game.map_position.y = Math.min(Game.map_size.height - Game.map_size.windowHeight, Game.map_position.y + 1);
        update = true;
      }
      if (update) {
        Game.drawMap();
      }
    };
  },
  
  drawMap: function() {
    for (var x = 0; x < Game.map_size.windowWidth; x++) {
      for (var y = 0; y < Game.map_size.windowHeight; y++) {
        Crafty.e('2D, Canvas, Color')
          .attr({
            x: x * Game.map_size.tile.width,
            y: y * Game.map_size.tile.height,
            w: Game.map_size.tile.width,
            h: Game.map_size.tile.height
          })
          .color(Game.map[x + Game.map_position.x][y + Game.map_position.y]);
      }
    }
          
  }
}