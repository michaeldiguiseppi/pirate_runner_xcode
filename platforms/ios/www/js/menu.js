var platform = platform || {};

platform.Menu = function() {};





platform.Menu.prototype = {
    create: function() {
        
        // set the scaling mode to SHOW_ALL to show all the platform.game
        platform.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        
        // set a minimum and maximum size for the platform.game
        // here the minimum is half the platform.game size
        // and the maximum is the original platform.game size
        platform.game.scale.setMinMax(platform.game.width/2, platform.game.height/2, platform.game.width, platform.game.height);
        
        
        
        platform.game.scale.pageAlignHorizontally = true;
        platform.game.scale.pageAlignVertically = true;
        
        this.game.stage.backgroundColor = '#707070';
        background = this.game.add.tileSprite(0, 0, window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, 'menu-back');
        this.game.add.text(220,50, 'Welcome to ze Game!!!', {font:'20px Arial', fill: '#fff'});

        this.game.add.button(200,240, 'box', this.startGame, this, 2, 1, 0);
        this.game.add.button(1084,240, 'box', this.startGame, this, 2, 1, 0);

    },
    update: function() {

    },
    startGame: function() {
        console.log("Click registered");
        platform.game.state.start('Game');
    }
};