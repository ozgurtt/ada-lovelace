

var game = new Phaser.Game(1180, 781, Phaser.AUTO, '');
//game.time.deltaCap = 0.05;//addresses an issue where player falls through tiles
var player;
var gravity=850;

var mainState = {
    preload: function() {
	game.stage.setBackgroundColor('#333');
		tutorialText = game.add.text(50, 250, "Loading", {
	    font: '40px Helvetica',
	    fill: '#999'
	});
    //game.load.image('plainBackground', 'assets/plain-background.png');
    game.load.image('player', 'postcards-assets/player.png');
	game.load.image('background', 'postcards-assets/background.jpg');
	
	},

	create: function() {		
    	game.physics.startSystem(Phaser.Physics.ARCADE);
		game.add.sprite(0, 0, 'background');
		cursors = game.input.keyboard.createCursorKeys();
		player = game.add.sprite(64, 200, 'player');
		game.physics.arcade.enable(player);
		player.body.velocity.x=0;
		player.body.velocity.y=0;
		player.body.bounce.y = 0.2;
		player.body.gravity.y = 80;
		player.body.collideWorldBounds = true;
						
	},
	
	update: function() {
	
			player.body.velocity.x = 0;
		if (cursors.left.isDown) {
			player.body.velocity.x = -220;
			//player.flipped=true;
		} else if (cursors.right.isDown) {
			player.body.velocity.x = 220;
			//player.flipped=false;
		}
		if (cursors.up.isDown)
		{
			player.body.velocity.y = -80;
		} 
	}
}

game.state.add('main', mainState);//the game 
//game.state.add('menu', menuState);//intro screen 
game.state.start('main'); 
