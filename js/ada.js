

var game = new Phaser.Game(800, 600, Phaser.AUTO, '');

var player;
var platforms;
var doors;
var cursors;
var machine;
var gravity=900;

var punchcards;
//var stars;
var score = 0;
var scoreText;

var mainState = {

    preload: function() {
    game.load.image('library', 'assets/library.jpg');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('introScreen', 'assets/intro-exterior.jpg');
    //game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
	game.load.image('ada', 'assets/ada.png');
	game.load.image('punchcard', 'assets/punchcard.png');
	game.load.image('ivo', 'assets/ivo.png');
	game.load.image('exitDoor','assets/blue-door.png');

	},


	create: function() {
    	//  We're going to be using physics, so enable the Arcade Physics system
    	game.physics.startSystem(Phaser.Physics.ARCADE);

    	//  A simple background for our game
    	game.add.sprite(0, 0, 'library');

    	//  The platforms group contains the ground and the 2 ledges we can jump on
    	platforms = game.add.group();

		//  We will enable physics for any object that is created in this group
		platforms.enableBody = true;
	
		// Here we create the ground.
		var ground = platforms.create(0, game.world.height - 64, 'ground');
	
		//  Scale it to fit the width of the game (the original sprite is 400x32 in size)
		ground.scale.setTo(2, 2);
	
		//  This stops it from falling away when you jump on it
		ground.body.immovable = true;
		doors=game.add.group();
		doors.enableBody=true;
		var exitDoor = doors.create(780, game.world.height - 130, 'exitDoor');
		//exitDoor.scale.setTo(2,2);
		
		exitDoor.body.immovable=true;
		
			
		//  Now let's create two ledges
		//var ledge = platforms.create(400, 400, 'ground');
		//ledge.body.immovable = true;
	
		//ledge = platforms.create(-150, 250, 'ground');
		//ledge.body.immovable = true;
	
		// The player and its settings
		player = game.add.sprite(32, game.world.height - 150, 'ada');
		machine = game.add.sprite(400, game.world.height - 113, 'ivo');
		
		game.physics.arcade.enable(machine);
		//  We need to enable physics on the player
		game.physics.arcade.enable(player);
	
		//  Player physics properties. Give the little guy a slight bounce.
		player.body.bounce.y = 0.2;
		player.body.gravity.y = gravity;
		player.body.collideWorldBounds = true;
		//machine.body.bounce.y=0.2;
		//machine.body.gravity.y=gravity;
		machine.body.collideWorldBounds = true;
		machine.body.immovable = true;
		//TODO: When Ivo moves, set immovable false, and give it gravity.

		punchcards = game.add.group();
		punchcards.enableBody = true;
		var punchcard=punchcards.create(600, 400, 'punchcard');
		punchcard.body.gravity.y = 300;
		punchcard.body.bounce.y=0.3;
		
		//  Here we'll create 12 of them evenly spaced apart
		/*for (var i = 0; i < 12; i++)
		{
			//  Create a star inside of the 'stars' group
			var punchcard = punchcards.create(i * 70, 0, 'punchcard');
	
			//  Let gravity do its thing
			punchcard.body.gravity.y = 300;
	
			//  This just gives each star a slightly random bounce value
			punchcard.body.bounce.y = 0.7 + Math.random() * 0.2;
		}*/
		
		
		
		//  The score
		scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
	
		//  Our controls.
		cursors = game.input.keyboard.createCursorKeys();		
	},
	
	update: function() {
	
		//  Collide the player and the stars with the platforms
		game.physics.arcade.collide(player, platforms);
		game.physics.arcade.collide(player, doors);
		game.physics.arcade.collide(punchcards, platforms);
		game.physics.arcade.collide(machine, platforms);
		game.physics.arcade.collide(player, machine,inputCode, null, this);
		//  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
		game.physics.arcade.overlap(player, punchcards, collectPunchcard, null, this);
		
		//  Reset the players velocity (movement)
		player.body.velocity.x = 0;
	
		if (cursors.left.isDown)
		{
			//  Move to the left
			player.body.velocity.x = -250;
	
			//player.animations.play('left');
		}
		else if (cursors.right.isDown)
		{
			//  Move to the right
			player.body.velocity.x = 250;
	
			//player.animations.play('right');
		}
		else
		{
			//  Stand still
			player.animations.stop();
	
			//player.frame = 4;
		}
		
		//  Allow the player to jump if they are touching the ground.
		if (cursors.up.isDown && player.body.touching.down)
		{
			player.body.velocity.y = -450;
		}

	}
}
var menuState = {
		preload : function(){
			game.load.image('introScreen', 'assets/intro-exterior.jpg');
		},

		create : function(){
			game.add.sprite(0, 0, 'introScreen');
		},

		update : function(){
			if(this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER))
				this.game.state.start('main');
		}
	}
game.state.add('main', mainState); 
game.state.add('menu', menuState); 
game.state.start('menu'); 

function collectPunchcard (player, punchcard) {
    punchcard.kill();
    score += 1;
    scoreText.text = 'Punchcards: ' + score;

}
function inputCode (player, machine){
	scoreText.text = 'Ada touches ivo';
}
