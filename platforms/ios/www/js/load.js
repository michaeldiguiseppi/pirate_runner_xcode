var platform = platform || {};

platform.game = new Phaser.Game(1334, 750, Phaser.AUTO, 'gameArea');
//
//var lawnchair = new Lawnchair({table:'localScores', adaptor:'webkit'}, function(){
//    // Lawnchair setup!
//});

var gameWorld = [];
var timer = 0;
var frame = "";
var color = "";
var gameState = { color: "", position: 0 };
var Score = 0;


platform.game.state.add('Preload', platform.Preload);
platform.game.state.add('Menu', platform.Menu);
platform.game.state.add('Game', platform.Game);
platform.game.state.add('GameOver', platform.GameOver);

platform.game.state.start('Preload');
