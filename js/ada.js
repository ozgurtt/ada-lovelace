

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
	game.load.image('ada', 'assets/ada.png');
	game.load.image('punchcard', 'assets/punchcard.png');
	game.load.image('ivo', 'assets/ivo.png');
	game.load.image('exitDoor','assets/blue-door.png');
	game.load.image('punchcardMenu','assets/punchcard-menu.jpg');
	},


	create: function() {
    	game.physics.startSystem(Phaser.Physics.ARCADE);
		//level backrground
    	game.add.sprite(0, 0, 'library');
		//platforms and ground
    	platforms = game.add.group();
		platforms.enableBody = true;
		var ground = platforms.create(0, game.world.height - 64, 'ground');
		//double width to fit screen resolution
		ground.scale.setTo(2, 2);
		ground.body.immovable = true;
		
		doors=game.add.group();
		doors.enableBody=true;
		var exitDoor = doors.create(780, game.world.height - 130, 'exitDoor');
		
		exitDoor.body.immovable=true;
	
		player = game.add.sprite(32, game.world.height - 150, 'ada');
		game.physics.arcade.enable(player);
		player.body.bounce.y = 0.2;
		player.body.gravity.y = gravity;
		player.body.collideWorldBounds = true;
		
		machine = game.add.sprite(400, game.world.height - 113, 'ivo');
		game.physics.arcade.enable(machine);
		machine.body.collideWorldBounds = true;
		machine.body.immovable = true;
		//TODO: When Ivo moves, set immovable false, and give it gravity.

		punchcards = game.add.group();
		punchcards.enableBody = true;
		var punchcard=punchcards.create(600, 400, 'punchcard');
		punchcard.body.gravity.y = 300;
		punchcard.body.bounce.y=0.3;
		
		scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
		cursors = game.input.keyboard.createCursorKeys();		
	},
	
	update: function() {
		game.physics.arcade.collide(player, platforms);
		game.physics.arcade.collide(player, doors);
		game.physics.arcade.collide(punchcards, platforms);
		game.physics.arcade.collide(machine, platforms);
		game.physics.arcade.collide(player, machine,inputCode, null, this);
		game.physics.arcade.overlap(player, punchcards, collectPunchcard, null, this);
		
		//  Stop Ada
		player.body.velocity.x = 0;
	
		if (cursors.left.isDown)
		{
			player.body.velocity.x = -250;
		}
		else if (cursors.right.isDown)
		{
			player.body.velocity.x = 250;
		}
		if (cursors.up.isDown && player.body.touching.down)
		{
			player.body.velocity.y = -450;
		}

	}
}
var level2 = {

    /*preload: function() {
    game.load.image('library', 'assets/library.jpg');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('introScreen', 'assets/intro-exterior.jpg');
	game.load.image('ada', 'assets/ada.png');
	game.load.image('punchcard', 'assets/punchcard.png');
	game.load.image('ivo', 'assets/ivo.png');
	game.load.image('exitDoor','assets/blue-door.png');
	game.load.image('punchcardMenu','assets/punchcard-menu.jpg');
	},*/


	create: function() {
    	game.physics.startSystem(Phaser.Physics.ARCADE);
		//level backrground
    	game.add.sprite(0, 0, 'library');
		//platforms and ground
    	platforms = game.add.group();
		platforms.enableBody = true;
		var ground = platforms.create(0, game.world.height - 64, 'ground');
		//double width to fit screen resolution
		ground.scale.setTo(2, 2);
		ground.body.immovable = true;
		
		doors=game.add.group();
		doors.enableBody=true;
		var exitDoor = doors.create(780, game.world.height - 130, 'exitDoor');
		
		exitDoor.body.immovable=true;
	
		player = game.add.sprite(32, game.world.height - 500, 'ada');
		game.physics.arcade.enable(player);
		player.body.bounce.y = 0.2;
		player.body.gravity.y = gravity;
		player.body.collideWorldBounds = true;
		
		machine = game.add.sprite(400, game.world.height - 113, 'ivo');
		game.physics.arcade.enable(machine);
		machine.body.collideWorldBounds = true;
		machine.body.immovable = true;
		//TODO: When Ivo moves, set immovable false, and give it gravity.

		punchcards = game.add.group();
		punchcards.enableBody = true;
		var punchcard=punchcards.create(600, 400, 'punchcard');
		punchcard.body.gravity.y = 300;
		punchcard.body.bounce.y=0.3;
		
		scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
		cursors = game.input.keyboard.createCursorKeys();		
	},
	
	update: function() {
		game.physics.arcade.collide(player, platforms);
		game.physics.arcade.collide(player, doors);
		game.physics.arcade.collide(punchcards, platforms);
		game.physics.arcade.collide(machine, platforms);
		game.physics.arcade.collide(player, machine,inputCode, null, this);
		game.physics.arcade.overlap(player, punchcards, collectPunchcard, null, this);
		
		//  Stop Ada
		player.body.velocity.x = 0;
	
		if (cursors.left.isDown)
		{
			player.body.velocity.x = -250;
		}
		else if (cursors.right.isDown)
		{
			player.body.velocity.x = 250;
		}
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
game.state.add('level2', level2); 
game.state.add('menu', menuState); 
game.state.start('menu'); 

function collectPunchcard (player, punchcard) {
    punchcard.kill();
    score += 1;
    scoreText.text = 'Punchcards: ' + score;

}
function inputCode (player, machine){
	game.add.sprite(0,0,'punchcardMenu');
	this.game.state.start('level2'); //TEST code
}
