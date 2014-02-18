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
//     Game.map = new Array();
//     for (var x = 0; x < Game.map_size.width; x++) {
//       Game.map[x] = new Array();
//       for (var y = 0; y < Game.map_size.height; y++) {
//         Game.map[x][y] = 'rgb(0,200,260)';
//       }
//     }
    // Start crafty and set a background color so that we can see it's working
    Crafty.init(Game.getViewWidth(), Game.getViewHeight());
    Crafty.background('rgb(60, 140, 20)');
    // Simply start the "Loading" scene to get things going
    Crafty.scene('Loading');
  }
},

$text_css = {'family': 'Arial', 'color': 'white', 'text-align': 'center' }