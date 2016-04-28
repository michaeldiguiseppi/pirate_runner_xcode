var platform = platform || {};

platform.Menu = function() {};





platform.Menu.prototype = {
    create: function() {
        
        this.game.stage.backgroundColor = '#707070';
        background = this.game.add.tileSprite(0, 0, platform.game.width, platform.game.height, 'menu-back');
        this.game.add.text(220,50, 'Welcome to ze Game!!!', {font:'20px Arial', fill: '#fff'});

        this.game.add.button(200,256, 'box', this.startGame, this, 2, 1, 0);
        this.game.add.button(384,256, 'box', this.startGame, this, 2, 1, 0);

    },
    update: function() {

    },
    startGame: function() {
        console.log("Click registered");
        platform.game.state.start('Game');
    }
};