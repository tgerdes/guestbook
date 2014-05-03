// var canvas=document.getElementById('myCanvas');
// var ctx=canvas.getContext('2d');
// ctx.fillStyle='#FFFF00';
// ctx.fillRect(0,0,80,100);

Game = {
  map_size: {
    // 640x800
    windowWidth: 25,
    windowHeight: 19,
    width:  64,
    height: 64,
    tile: {
      width:  32,
      height: 32
    }
  },
  
  constants: {
    tileSet: 0,
    finaleTextDuration: 150,
    textDuration: 250,
    guestsPerRoom: 8,
    initX: 12,
    initY: 9
  },
  
  map: {
    pc: null,
    p2: null,
    lastDir: null,
    id: 0,
    count: 2,
    door: 8,
    startX: 12,
    startY: 9,
    init: function() {
      this.count = Math.ceil(Game.guests.total / Game.constants.guestsPerRoom);
      this.occupied = new Array(Game.map_size.windowWidth);
      for (var x = 0; x < Game.map_size.windowWidth; x++) {
        this.occupied[x] = new Array(Game.map_size.windowHeight);
        for (var y = 0; y < Game.map_size.windowHeight; y++) {
          this.occupied[x][y] = false;
        }
      }
    },
  
    occupy: function(x, y, width, height) {
      for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
          if (x + i < this.occupied.length && y + j < this.occupied[x + i].length ) {
            this.occupied[x + i][y + j] = true; 
          }
        }
      }
    },
    
    isOccupied: function(x, y, width, height) {
      for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
          if (x + i < this.occupied.length && y + j < this.occupied[x + i].length ) {
            if (this.occupied[x + i][y + j]) {
              return true;
            } 
          } else {
            return true;
          }
        }
      }
      return false;
    }
  },
  
  guests: {
    total: 20, // total number of guests that were loaded
    count: 0, // number of guests currently in the scene
    guestViews: new Array(),
    files: ['assets/face-e.png', 'assets/face-r.png', 'assets/face-j.png', 'assets/face-t.png', 'assets/face-s.png'],
    sayings: ['Wat?', 'Noooo!', 'Yesss!', 'Guys?', 'Umm...'],
    bodies: [6, 7, 8, 9, 5],
    hairs: [6, 10, 15, 9, 1],
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
    face: function (spriteName, url, sizeW, sizeH) {
        var temp, x, y, w, h, img;
        var paddingY = 0, paddingX = 0;
        if (!sizeW) {
          sizeW = 48;
        }
        if (!sizeH) {
          sizeH = 66;
        }

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
            this.__coord = [0, 0, sizeW, sizeH];
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

$text_css = {'family': 'Arial', 'color': 'black', 'text-align': 'center' }