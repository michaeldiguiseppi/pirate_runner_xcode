var platform = platform || {};

platform.Preload = function() {};


platform.Preload.prototype = {
    preload: function() {
        this.load.image('ground', 'assets/gray.png');
        this.load.image('box', 'assets/RTS_Crate.png');
        this.load.image('coin', 'assets/coin_01.png');
        this.load.image('menu', 'assets/lazy_menu.png');
        this.load.spritesheet('hero', 'assets/Run.png', 33.6, 50, 8);
        this.load.image('jump-button', 'assets/jump-Button.png');
        this.load.image('flip-button', 'assets/flip-Button.png');
        this.load.image('background', 'assets/pirate.jpg');
        this.load.image('menu-back', 'assets/pirate_entry.png');
      },
    create: function() {


        this.state.start('Menu');
    }
};


// 67 by 100 high
