
//function preload() {//Load the tilemap file    platform.game.load.tilemap('myGame', 'assets/tmx1.json', null, Phaser.Tilemap.TILED_JSON);//Load the spritesheet for the tilemap    platform.game.load.image('tiles', 'assets/main.png');//Load other assets, the playerplatform.game.load.spritesheet('player', 'assets/sprites/male_hero_1.png', 16, 16, 4);}var map;var layer;function create() {    map = platform.game.add.tilemap('myGame');//'main' is the name of the spritesheet inside of Tiled Map Editor    map.addTilesetImage('main', 'tiles');//'Grass 1' is the name of a layer inside of Tiled Map Editor    layer = map.createLayer('Grass 1');    layer.resizeWorld();//Add playerplatform.game.add.sprite(300, 200, 'player');}function update() {}

var platform = platform || {};

platform.Game = function(){};

platform.Game.prototype = {
  velocity: -300,
  gravity: 1000,
  jumpHeight: 500,
  fps: 15,
  create: function() {
      console.log("Game is running!");

    if (platform.game.device.desktop === false) {
      // set the scaling mode to SHOW_ALL to show all the platform.game
      platform.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

      // set a minimum and maximum size for the platform.game
      // here the minimum is half the platform.game size
      // and the maximum is the original platform.game size
      platform.game.scale.setMinMax(platform.game.width/2, platform.game.height/2, platform.game.width, platform.game.height);

    }

    backgound = platform.game.add.tileSprite(0, 0, platform.game.width, platform.game.height, 'background');

    // center the platform.game horizontally and vertically
    platform.game.scale.pageAlignHorizontally = true;
    platform.game.scale.pageAlignVertically = true;



    // platform.game.stage.backgroundColor = '#27d9d3';
    platform.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.player = platform.game.add.sprite(33.6, 50, 'hero');

    var walk = this.player.animations.add('walk');
    this.player.animations.play('walk', this.fps, true);

    this.score = 0;
    this.labelScore = platform.game.add.text(20, 20, '0', {font: "30px Arial", fill: 'white'});

    //Iphone Flip buttons
    buttonJump = this.game.add.button(50,600, 'jump-button', this.jump, this, 2, 1, 0);
    buttonFlip = this.game.add.button(1150,600, 'flip-button', this.flip, this, 2, 1, 0);

    platform.game.physics.arcade.enable(this.player);

    this.player.body.gravity.y = this.gravity;
    this.player.anchor.setTo(0.5, 0.5);

    //Desktop Flip Control
    var spaceKey = platform.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    var downKey = platform.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    spaceKey.onDown.add(this.jump, this);
    downKey.onDown.add(this.flip, this);

    this.game.world.width = 50000;

    this.ground = this.add.tileSprite(0, this.game.height- 375, this.game.world.width, 50, 'ground');
    this.game.world.bringToTop(this.ground);

    this.game.physics.arcade.enable(this.ground);

    this.ground.body.immovable = true;
    this.ground.body.allowGravity = false;

    this.timer = platform.game.time.events.loop(100, this.addBoxes, this);

    this.boxes = platform.game.add.group();
    this.coins = platform.game.add.group();
    this.increaseTimer = platform.game.time.events.loop(15000, this.increaseVelocity, this);



  },
  gameOver: function(){
        // When the paus button is pressed, we pause the game
      console.log(window.localStorage.getItem("scoresObj"));
      if (window.localStorage.getItem("scoresObj")){
          var scores = JSON.parse(window.localStorage.getItem("scoresObj"));
          console.log(scores);
          var length = Object.keys(scores);
          var gameNum = +length + 1;
          var score = this.score;
          scores[gameNum] = score;
          
          window.localStorage.setItem("scoresObj", JSON.stringify(scores));
          console.log(JSON.parse(window.localStorage.getItem("scoresObj")));
      } else {
          window.localStorage.setItem("scoresObj", JSON.stringify({1: this.score}));
      }
      
      var data = JSON.stringify({
                                "name": "Danny Robinson App",
                                "score": this.score
                                });
      
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      
      xhr.addEventListener("readystatechange", function () {
                           if (this.readyState === 4) {
                           console.log(this.responseText);
                           }
                           });
      console.log("Data to send: ", data);
      xhr.open("POST", "https://pirate-runner.herokuapp.com/score");
      xhr.setRequestHeader("content-type", "application/json");
      xhr.setRequestHeader("cache-control", "no-cache");
      
      xhr.send(data);
      
    platform.game.paused = true;
    console.log(this.score);
    // Then add the menu
    menu = platform.game.add.sprite(platform.game.width/2, platform.game.height/2, 'menu');
    menu.anchor.setTo(0.5, 0.5);

    platform.game.input.onDown.add(this.unpause, self);


  },
  unpause: function(event){
      // Only act if paused
      if(platform.game.paused){
          // Calculate the corners of the menu
          var x1 = platform.game.width/2 - 270/2, x2 = platform.game.width/2 + 270/2,
              y1 = platform.game.height/2 - 180/2, y2 = platform.game.height/2 + 180/2;
          // Check if the click was inside the menu
          if(event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2 ){
              platform.game.paused = false;
              platform.game.state.start('Menu');
          } else {
            platform.game.paused = false;
              platform.game.state.start('Game');
          }
      }
  },
  update: function() {
    this.game.physics.arcade.collide(this.player, this.ground, null, null, this);
    this.game.physics.arcade.overlap(this.player, this.coins, this.collectCoin, null, this);
    this.game.physics.arcade.overlap(this.player, this.boxes, this.playerHit, null, this);

  },
  playerHit: function() {
   platform.game.time.events.remove(this.timer);
   this.boxes.forEach(function(box) {
     box.body.velocity.x = 0;
   }, this);
   this.gameOver();
  },
  jump: function() {
    var animation = platform.game.add.tween(this.player);

    animation.to({angle: this.player.angle + 360}, 300);

    if (this.player.body.touching.down) {
      this.player.body.velocity.y = -(this.jumpHeight);
      animation.start();
    } else if ( this.player.body.touching.up) {
      this.player.body.velocity.y = this.jumpHeight;
      animation.start();
    }
  },
  flip: function() {
    var animation;
    if ( this.player.body.touching.down ){
      this.player.x = 50;
      this.player.y = 450;
      this.player.scale.y = -1;
      this.player.body.gravity.y = -(this.gravity);
    } else if ( this.player.body.touching.up ){
      this.player.x = 50;
      this.player.y = 350;
      this.player.scale.y = 1;
      this.player.body.gravity.y = this.gravity;
    }
  },
  addBox: function(x, y, velocity) {
    var box = platform.game.add.sprite(x, y, 'box');

    this.boxes.add(box);

    platform.game.physics.arcade.enable(box);

    box.body.velocity.x = this.velocity;

    box.checkWorldBounds = true;
    box.outOfBoundsKill = true;
  },
  incrementer: 0,
  increaseVelocity: function() {
    this.velocity -= 100;
    this.gravity += 400;
    this.jumpHeight += 50;
    this.fps += 2;
  },
  heights: [480, 325, 425, 260],
  addBoxes: function() {
    this.incrementer++;
    var rand = Math.floor(Math.random() * 10);
    if ( rand > 7 && this.incrementer > 5){
      this.incrementer = 0;
      var randHeight = Math.floor(Math.random() * 4);
      this.addBox(1334, this.game.height-this.heights[randHeight], this.velocity);
      if (rand > 8 ){
         switch (this.heights[randHeight]){
           case 260:
             this.addCoin(1334, this.game.height-this.heights[randHeight] - 55, this.velocity);
           break;
           case 325:
             this.addCoin(1334, this.game.height-this.heights[randHeight] + 75, this.velocity);
           break;
           case 425:
             this.addCoin(1334, this.game.height-this.heights[randHeight] - 75, this.velocity);
           break;
           case 480:
             this.addCoin(1334, this.game.height-this.heights[randHeight] + 55, this.velocity);
           break;
         }
       }
       //End Add Coint Functionality
    }
  },
  addCoin: function(x, y, velocity){
     var coin = platform.game.add.sprite(x, y, 'coin');
     coin.height = 50;
     coin.width = 50;
     this.coins.add(coin);
     platform.game.physics.arcade.enable(coin);
     coin.body.velocity.x = this.velocity;
     coin.checkWorldBounds = true;
     coin.outOfBoundsKill = true;
   },
   collectCoin: function(){
     //Below is the function to destroy the coin.
     this.coins.getFirstAlive().destroy();
     this.score += 1;
     this.labelScore.text = this.score;
   },

};

//

// platform.game.state.add('main', mainState, true);
