/* Ada - a puzzle platformer
   By: Luc CB
   TODO: Add credits
   -clean up code
   -OOPify this shit. Global variables should mostly go.
   -level creation/destruction, next big goal.
*/

var game = new Phaser.Game(800, 600, Phaser.AUTO, '');

var player;
var platforms;
var doors;
var exitDoor;
var exitLight;
var cursors;
var machine;
var ivoMenu;
var ivoCommandsBackground;
var ivoMenuButtons=new Object();
var closeToIvo=false; // Keep track of if Ada is near Ivo to issue commands.
/*var ivoMenuEject;
var ivoMenuExit;
var ivoMenuExecute;
var ivoMenuMoveLeft;
var ivoMenuMoveRight;
var ivoMenuBlueDoor;
var ivoMenuYellowDoor;*/
var gravity=900;

var punchcards;
var collectedPunchcards = 0;
var punchcardText;
var tutorialText;

var mainState = {

    preload: function() {
    game.load.image('plainBackground', 'assets/plain-background.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('introScreen', 'assets/intro-exterior.jpg');
	game.load.image('ada', 'assets/ada.png');
	game.load.image('punchcard', 'assets/punchcard.png');
	game.load.image('ivo', 'assets/ivo.png');
	game.load.image('blueDoor','assets/blue-door.png');
	game.load.image('exitLight','assets/exit-light.png');
	game.load.image('punchcardMenu','assets/punchcard-menu.jpg');
	game.load.image('menuButtonAdd','assets/menu-button-add.jpg');
	game.load.image('punchcardMenu','assets/punchcard-menu.jpg');
	game.load.image('menuCommands','assets/menu-commands.png');
	game.load.image('menuEject','assets/menu-eject-cards.png');
	game.load.image('menuExit','assets/menu-exit.png');
	game.load.image('menuExecute','assets/menu-execute.png');
	game.load.image('menuMoveLeft','assets/menu-move-left.png');
	game.load.image('menuMoveRight','assets/menu-move-right.png');
	game.load.image('menuBlueDoor','assets/menu-open-blue-door.png');
	game.load.image('menuYellowDoor','assets/menu-open-yellow-door.png');
	},


	create: function() {		
    	game.physics.startSystem(Phaser.Physics.ARCADE);
		//level backrground, 80x80 px, sacled x10 to fit screen
    	var background = game.add.sprite(0, 0, 'plainBackground');
		background.scale.setTo(10,10);
		//platforms and ground
    	platforms = game.add.group();
		platforms.enableBody = true;
		var ground = platforms.create(0, game.world.height - 64, 'ground');
		//double width to fit screen resolution
		ground.scale.setTo(2, 2);
		ground.body.immovable = true;
		
		doors=game.add.group();
		doors.enableBody=true;
		
		exitLight = game.add.sprite(780, game.world.height-130, 'exitLight');
		game.physics.arcade.enable(exitLight);
		exitLight.body.collideWorldBounds = true;
		exitLight.body.immovable = true;
		exitLight.exists=false;
		
		exitDoor = doors.create(780, game.world.height - 130, 'blueDoor');
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
		
		machine.anchor.setTo(0.25,0);//for calculating distance between player and Ivo
		//TODO: When Ivo moves, set immovable false, and give it gravity.
		
		//setting up the menu and submenu for Ivo but not displaying until we need to.
		//ordered so that the later images are on top
		ivoMenu = game.add.sprite(0,0,'punchcardMenu');
		ivoMenu.visible=false;
		//ivoButtonAdd = game.add.button(15, 20, 'menuButtonAdd', clickButtonAdd);
		//ivoButtonAdd.visible = false;
		ivoMenuButtons.addCommand=game.add.button(15, 20, 'menuButtonAdd', clickButtonAdd);
		ivoMenuButtons.addCommand.visible=false;
		ivoMenuButtons.exit=game.add.button(15,300,'menuExit');
		ivoMenuButtons.exit.visible=false;
		ivoMenuButtons.execute=game.add.button(15,500,'menuExecute');
		ivoMenuButtons.execute.visible=false;
		ivoCommandsBackground = game.add.sprite(40,40,'menuCommands');
		ivoCommandsBackground.visible=false;
		ivoMenuButtons.moveLeft=game.add.button(45,100,'menuMoveLeft');
		ivoMenuButtons.moveLeft.visible=false;
		ivoMenuButtons.moveRight=game.add.button(45,200,'menuMoveRight');
		ivoMenuButtons.moveRight.visible=false;
		ivoMenuButtons.blueDoor=game.add.button(45,300,'menuBlueDoor',clickBlueDoor);
		ivoMenuButtons.blueDoor.visible=false;
		ivoMenuButtons.yellowDoor=game.add.button(45,400,'menuYellowDoor');
		ivoMenuButtons.yellowDoor.visible=false;
		
		punchcards = game.add.group();
		punchcards.enableBody = true;
		var punchcard=punchcards.create(600, 400, 'punchcard');//this will have to go when we start setting up levels
		punchcard.body.gravity.y = 300;
		punchcard.body.bounce.y=0.3;
		
		punchcardText = game.add.text(16, 16, 'punchcards: 0', { fontSize: '32px', fill: '#000' });
		tutorialText = game.add.text(170,200,'arrow keys to move and jump', { fontSize:'64px', fill: '#000' });
		cursors = game.input.keyboard.createCursorKeys();		
	},
	
	update: function() {
		game.physics.arcade.collide(player, platforms);
		game.physics.arcade.collide(player, doors);
		game.physics.arcade.collide(punchcards, platforms);
		game.physics.arcade.collide(machine, platforms);
		game.physics.arcade.collide(player, machine);
		game.physics.arcade.overlap(player, punchcards, collectPunchcard, null, this);
		game.physics.arcade.collide(player, exitLight, touchExitLight,null,this);
		
		if(game.physics.arcade.distanceBetween(player, machine)<80) {
			if (!closeToIvo){
				closeToIvo=true;
				punchcardText.text=game.physics.arcade.distanceBetween(player, machine);//for testing
				tutorialText.text="press enter to program Ivo with punch cards";
			}
			inputCode(player,machine);
		} else if (closeToIvo) {
			closeToIvo=false;
			tutorialText.text="A command consumes a punch card";
			hideMenu();
		}
			
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
		else if (this.game.input.keyboard.isDown(Phaser.Keyboard.ESC))
		//TODO: boolean to show if the menu is open or closed. But how should I implement it?
		{
			hideCommandsMenu();
			hideMenu();
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
	
	
game.state.add('main', mainState);//the game 
game.state.add('menu', menuState);//intro screen 
game.state.start('menu'); 

function collectPunchcard (player, punchcard) {
    punchcard.kill();
    collectedPunchcards += 1;
    punchcardText.text = 'Punchcards: ' + collectedPunchcards;

}
function touchExitLight(player,exitLight){
	tutorialText.text="level complete";//not working right now don't know why.
}
function inputCode (player, machine){ //player can start programming when she's close to Ivo
	if(this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER)){
		showMenu();
	}
}
function clickButtonAdd () { //No point in showing the commands menu unless there's punchcards to burn
	if (collectedPunchcards>0) {
		ivoCommandsBackground.visible=true;
		ivoMenuButtons.moveLeft.visible=true;
		ivoMenuButtons.moveRight.visible=true;
		ivoMenuButtons.blueDoor.visible=true;
		ivoMenuButtons.yellowDoor.visible=true;
	} else {
		tutorialText.text="grab that card first";
	}
}
function hideCommandsMenu(){
	ivoCommandsBackground.visible=false;
	ivoMenuButtons.moveLeft.visible=false;
	ivoMenuButtons.moveRight.visible=false;
	ivoMenuButtons.blueDoor.visible=false;
	ivoMenuButtons.yellowDoor.visible=false;
}

function clickBlueDoor (){
	hideCommandsMenu();
	exitDoor.exists=false;
	exitLight.exists=true;
		
}
function showMenu() {
	ivoMenu.visible=true;
	ivoMenuButtons.addCommand.visible=true;
	ivoMenuButtons.exit.visible=true;
	ivoMenuButtons.execute.visible=true;
}
function hideMenu() {
	ivoMenu.visible=false;
	ivoMenuButtons.addCommand.visible=false;
	ivoMenuButtons.exit.visible=false;
	ivoMenuButtons.execute.visible=false;
}
	
