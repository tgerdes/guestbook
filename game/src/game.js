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
  
  guests: {
    count: 0,
    files: ['assets/face-e.png', 'assets/face-c.png', 'assets/face-e-sq.png'],
    sprites: new Array(),
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

Crafty.extend({
    face: function (spriteName, url) {
        var temp, x, y, w, h, img;
        var paddingY = 0, paddingX = 0;

        var markSpritesReady = function() {
            this.ready = true;
            this.trigger("Invalidate");
        };

        img = Crafty.asset(url);
        if (!img) {
            img = new Image();
            img.src = url;
            Crafty.asset(url, img);
            img.onload = function () {
                //all components with this img are now ready
                Crafty(spriteName).each(markSpritesReady);
            };
        }

        var sharedSpriteInit = function() {
            this.requires("2D, Sprite");
            this.__trim = [0, 0, 0, 0];
            this.__image = url;
            this.__coord = [0, 0, 48, 66];
            this.__tile = 1;
            this.__tileh = 1;
            this.__padding = [paddingX, paddingY];
            this.__padBorder = 0;
            this.sprite(this.__coord[0], this.__coord[1], this.__coord[2], this.__coord[3]);
            
            this.img = img;
            console.log("initializing sprite " + spriteName + " image complete? " + this.img.complete + " width? " + this.img.width);
            //draw now
            if (this.img.complete && this.img.width > 0) {
                this.ready = true;
                this.trigger("Invalidate");
            }

            //set the width and height to the sprite size
            this.w = this.__coord[2];
            this.h = this.__coord[3];
        };

        //generates sprite components for each tile in the map
        console.log("adding sprite with name " + spriteName);
        Crafty.c(spriteName, {
            ready: false,
            __coord: [0, 0, 48, 66],

            init: sharedSpriteInit
        });

        return this;
    }
});

$text_css = {'family': 'Arial', 'color': 'white', 'text-align': 'center' }