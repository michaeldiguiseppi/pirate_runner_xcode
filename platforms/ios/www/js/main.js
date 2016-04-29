

var platform = platform || {};

platform.Game = function(){};

platform.Game.prototype = {
  velocity: -350,
  gravity: 1000,
  jumpHeight: 700,
  fps: 15,
  create: function() {
      console.log("Game is running!");


    background = platform.game.add.tileSprite(0, 0, platform.game.width, platform.game.height, 'background');




    // platform.game.stage.backgroundColor = '#27d9d3';
    platform.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.player = platform.game.add.sprite(67, 100, 'hero');
    

    var walk = this.player.animations.add('walk');
    this.player.animations.play('walk', this.fps, true);

    this.score = 0;
    this.labelScore = platform.game.add.text(20, 20, '0', {font: "45px Arial", fill: 'white'});

    //Iphone Flip buttons
    buttonJump = this.game.add.button(50,600, 'jump-button', this.jump, this, 2, 1, 0);
    buttonFlip = this.game.add.button(1059 ,600, 'flip-button', this.flip, this, 2, 1, 0);

    platform.game.physics.arcade.enable(this.player);

    this.player.body.gravity.y = this.gravity;
    this.player.anchor.setTo(0.5, 0.5);

    //Desktop Flip Control
    var spaceKey = platform.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    var downKey = platform.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    spaceKey.onDown.add(this.jump, this);
    downKey.onDown.add(this.flip, this);

    this.game.world.width = 50000;

    this.ground = this.add.tileSprite(0, this.game.height - 425, this.game.world.width, 100, 'ground');
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
      console.log("First High Score ", window.localStorage.getItem("highScore"));

          var highScore = parseInt(window.localStorage.getItem("highScore"));
          console.log("Curr high score: ", highScore);
          console.log("Curr Score: ", this.score);
      console.log("Is Greateer ", (this.score > highScore));
          if (this.score > highScore){
              console.log("it's greater!!!");
          window.localStorage.setItem("highScore", this.score);
          console.log("if high score ", window.localStorage.getItem("highScore"));
          }
      var currName = window.localStorage.getItem("currentUser");

      var data = JSON.stringify({
                                "name": currName,
                                "score": this.score
                                });
      
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      
      xhr.addEventListener("readystatechange", function () {
                           if (this.readyState === 4) {
                           }
                           });
      console.log("Data to send: ", data);
      xhr.open("POST", "https://pirate-runner.herokuapp.com/score");
      xhr.setRequestHeader("content-type", "application/json");
      xhr.setRequestHeader("cache-control", "no-cache");
      
      xhr.send(data);
      
    platform.game.paused = true;
    console.log("here's the score" , this.score);
    // Then add the menu
    menu = platform.game.add.sprite(platform.game.width/2, platform.game.height/2, 'game-over');
      var currHighScore = window.localStorage.getItem("highScore");
      this.game.add.text(400,420, 'Your current high score: '+ currHighScore, {font:'50px Palatino Linotype', fill: 'white'});
    menu.anchor.setTo(0.5, 0.5);

    platform.game.input.onDown.add(this.unpause, self);


  },
  unpause: function(event){
      // Only act if paused
      if(platform.game.paused){
          // Calculate the corners of the menu
          var x1 = platform.game.width/2 - 600/2, x2 = platform.game.width/2 + 600/2,
              y1 = platform.game.height/2 - 330/2, y2 = platform.game.height/2 + 330/2;
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
      

    if (this.player.body.touching.down) {
      this.player.body.velocity.y = -(this.jumpHeight);
        
    } else if ( this.player.body.touching.up) {
      this.player.body.velocity.y = this.jumpHeight;
    }
  },
  flip: function() {
    var animation;
    if ( this.player.body.touching.down ){
      this.player.x = 50;
      this.player.y = 480;
      this.player.scale.y = -1;
      this.player.body.gravity.y = -(this.gravity);
    } else if ( this.player.body.touching.up ){
      this.player.x = 50;
      this.player.y = 260;
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
  heights: [640, 325, 525, 210],
  addBoxes: function() {
    this.incrementer++;
    var rand = Math.floor(Math.random() * 10);
    if ( rand > 7 && this.incrementer > 5){
      this.incrementer = 0;
      var randHeight = Math.floor(Math.random() * 4);
      this.addBox(1334, this.game.height-this.heights[randHeight], this.velocity);
      if (rand > 8 ){
         switch (this.heights[randHeight]){
           case 210:
             this.addCoin(1334, this.game.height-this.heights[randHeight] - 115, this.velocity);
           break;
           case 325:
             this.addCoin(1334, this.game.height-this.heights[randHeight] + 100, this.velocity);
           break;
           case 525:
             this.addCoin(1334, this.game.height-this.heights[randHeight] - 100, this.velocity);
           break;
           case 640:
             this.addCoin(1334, this.game.height-this.heights[randHeight] + 115, this.velocity);
           break;
         }
       }
       //End Add Coint Functionality
    }
  },
  addCoin: function(x, y, velocity){
     var coin = platform.game.add.sprite(x, y, 'coin');
     coin.height = 100;
     coin.width = 100;
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
