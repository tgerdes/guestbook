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
  
  map: {
    id: 0,
    count: 2,
    door: 8,
    startX: 11,
    startY: 8
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
    // Start crafty and set a background color so that we can see it's working
    Crafty.init(Game.getViewWidth(), Game.getViewHeight());
    Crafty.background('rgb(60, 140, 20)');
    // Simply start the "Loading" scene to get things going
    Crafty.scene('Loading');
  }
},

$text_css = {'family': 'Arial', 'color': 'white', 'text-align': 'center' }