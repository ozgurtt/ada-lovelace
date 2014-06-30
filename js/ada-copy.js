/* Ada - a puzzle platformer
   By: Luc CB
   TODO: Add credits
   -level creation/destruction, next goal.
*/

var game = new Phaser.Game(992, 512, Phaser.AUTO, '');
//game.time.deltaCap = 0.05;//addresses an issue where player falls through tiles
var player;
var layer;
var platforms;
var doors;
var exitDoor;
var exitArrow;
var cursors;
var machine;
var timer;
var timerIsRunning=false;
var ivoMenu;
var ivoCommandsBackground;
var ivoMenuButtons=new Object();
var closeToIvo=false; // Keep track of if Ada is near Ivo to issue commands.
var gravity=950;
var spikes;
var punchcards;
var collectedPunchcards = 0;
var spentPunchcards=0;
var punchcardText;
var tutorialText;
var codeText;
var timerText;
var commandQueue=[];
var level=1;
var mainState = {
    preload: function() {
	game.stage.setBackgroundColor('#333');
		tutorialText = game.add.text(50, 250, "Loading", {
	    font: '40px Helvetica',
	    fill: '#999'
	});
    //game.load.image('plainBackground', 'assets/plain-background.png');
    game.load.image('ground', 'assets/platform.png');
	game.load.image('spike', 'assets/spike.png');
    game.load.image('introScreen', 'assets/intro-exterior.jpg');
	game.load.image('ada', 'assets/ada.png');
	game.load.image('punchcard', 'assets/punchcard.png');
	game.load.image('ivo', 'assets/ivo-drawn.png');
	game.load.image('blueDoor','assets/blue-door.png');
	game.load.image('exitArrow','assets/exit-arrow.png');
	game.load.image('punchcardMenu','assets/punchcard-menu.jpg');
	game.load.image('menuButtonAdd','assets/menu-button-add.jpg');
	game.load.image('punchcardMenu','assets/punchcard-menu.jpg');
	game.load.image('menuCommands','assets/menu-commands.jpg');
	game.load.image('menuEject','assets/menu-eject-cards.png');
	//game.load.image('menuExit','assets/menu-exit.png');
	game.load.image('menuExecute','assets/menu-execute.png');
	game.load.image('menuMoveLeft','assets/menu-move-left.png');
	game.load.image('menuMoveRight','assets/menu-move-right.png');
	game.load.image('menuBlueDoor','assets/menu-open-blue-door.png');
	game.load.image('menuYellowDoor','assets/menu-open-yellow-door.png');
	game.load.image('menuRepeat','assets/menu-repeat.png');
	game.load.image('menuWait','assets/menu-wait.png');
	game.load.image('menuGravity','assets/menu-reverse-gravity.png');
	game.load.tilemap('level-1', 'assets/level-1.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.tilemap('level-2', 'assets/level-2.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.tilemap('level-3', 'assets/level-3.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('ada-tileset', 'assets/ada-tileset.png');
	},

	create: function() {		
    	game.physics.startSystem(Phaser.Physics.ARCADE);
		game.stage.backgroundColor = '#bfbeb2';
		//game.stage.backgroundColor = '#000';
    	timer = game.time.create(false);
		//  Set it to wait 5 seconds to trigger an event
		timer.loop(5000, updateCounter, this);
		//start timer in clickExecute function
		timerText = game.add.text(460, 16, '', { fontSize: '32px', fill: '#000' });
		timerText.fixedToCamera=true;
		punchcardText = game.add.text(260, 16, 'punchcards: 0', { fontSize: '32px', fill: '#000' });
		punchcardText.fixedToCamera=true;
		tutorialText.text="Arrow keys to move and jump";
		codeText = game.add.text(100,300,'code', { fontSize:'12px', fill: '#000' });
		codeText.visible=false;
		cursors = game.input.keyboard.createCursorKeys();
		loadLevel(level);
						
	},
	
	update: function() {
		game.physics.arcade.collide(player, layer);
		game.physics.arcade.collide(machine, layer);
		game.physics.arcade.collide(machine, spikes,touchSpikes,null, this);
		game.physics.arcade.collide(player, doors);
		game.physics.arcade.collide(machine, doors);
		game.physics.arcade.collide(punchcards, layer);
		game.physics.arcade.collide(player, machine);
		game.physics.arcade.overlap(player, punchcards, collectPunchcard, null, this);
		game.physics.arcade.collide(player, exitArrow, touchExitLight,null,this);
		game.physics.arcade.collide(player, spikes, touchSpikes,null,this);	
		if(game.physics.arcade.distanceBetween(player, machine)<100) {
			if (!closeToIvo){
				closeToIvo=true;
				tutorialText.text="press enter to program Ivo with punch cards";
			}
			inputCode(player,machine);
		} else if (closeToIvo) {
			closeToIvo=false;
			tutorialText.text="A command consumes a punch card";
			hideMenu();
		}			
		//  Stop Ada
		if ((machine.body.touching.up)&&(machine.body.velocity.x!=0)) {
			player.body.velocity.x=machine.body.velocity.x;
		} else {
			player.body.velocity.x = 0;
		}
		if ((machine.body.velocity.x==0) && (machine.body.velocity.y==0)) {
			machine.body.immovable=true;//When stationary we don't want Ivo be pushed around.
		}
	
		if (cursors.left.isDown) {
			player.body.velocity.x = -220;
			//player.flipped=true;
		} else if (cursors.right.isDown) {
			player.body.velocity.x = 220;
			//player.flipped=false;
		}
		if (cursors.up.isDown && (player.body.onFloor() || player.body.touching.down))//player may be standing on tiles or entities.  onFloor tests against tiles and body.touching other objects.
		{
			player.body.velocity.y = -450;//jump
		} else if (this.game.input.keyboard.isDown(Phaser.Keyboard.ESC)) {
			hideCommandsMenu();
			hideMenu();
		}
		if (timerIsRunning){
			timerText.text='Waiting: ' + timer.duration.toFixed(0);
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
game.state.start('main');//chage to menu to have intro screen 

function collectPunchcard (player, punchcard) {
    punchcard.kill();
    collectedPunchcards += 1;
    punchcardText.text = 'Punchcards: ' + collectedPunchcards;
}
function touchExitLight(player,exitLight){
	tutorialText.text="level complete";
	level++;
	loadLevel(level);
}
function touchSpikes(player,spikes){
	tutorialText.text="ouch";
	loadLevel(level);
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
		ivoMenuButtons.repeat.visible=true;
		ivoMenuButtons.wait.visible=true;
		ivoMenuButtons.reverseGravity.visible=true;
	} else if (exitArrow.getAt(0).exists){
		tutorialText.text="Head out";//why won't it work?
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
	ivoMenuButtons.repeat.visible=false;
	ivoMenuButtons.wait.visible=false;
	ivoMenuButtons.reverseGravity.visible=false;
}
function clickEject (){
	if (spentPunchcards>0){
		collectedPunchcards=spentPunchcards;
		spentPunchcards=0;
		punchcardText.text = 'Punchcards: ' + collectedPunchcards;
		commandQueue.length=0;
		ivoMenuButtons.codeText.text="";
	}
}
function clickExecute (){
	if (commandQueue[0]=="Open blue door") {
		doors.getAt(0).exists=false;//for now, this is where we have our exit door stored in the group.
		exitArrow.getAt(0).exists=true;
		hideMenu();
	} else if (commandQueue[0]=="Move right"){
		machine.body.immovable = false;
		machine.body.velocity.x=650;
		if (machine.body.touching.up) {
			player.body.velocity.x=machine.body.velocity.x;
		}
		hideMenu();
	} else if (commandQueue[0]=="Move left"){
		machine.body.immovable = false;
		machine.body.velocity.x=-650;
		if (machine.body.touching.up) {
			player.body.velocity.x=machine.body.velocity.x;
		}
		hideMenu();
	} else if (commandQueue[0]=="Wait 5 seconds"){
		timerIsRunning=true;
		timer.start();
		timerText.text='Waiting: ' + timer.duration.toFixed(0);
		hideMenu();
	}
}
function clickMoveRight(){
	hideCommandsMenu();
	commandQueue[0]="Move right";
	ivoMenuButtons.codeText.text+=commandQueue.length+": "+commandQueue[0];
	spendCard();
}
function clickMoveLeft(){
	hideCommandsMenu();
	commandQueue[0]="Move left";
	ivoMenuButtons.codeText.text+=commandQueue.length+": "+commandQueue[0];
	spendCard();
}
function clickBlueDoor (){
	
	commandQueue[0]="Open blue door";
	hideCommandsMenu();
	ivoMenuButtons.codeText.text+=commandQueue.length+": "+commandQueue[0];
	spendCard();
}
function clickRepeat (){
	
	commandQueue[0]="Repeat";
	hideCommandsMenu();
	ivoMenuButtons.codeText.text+=commandQueue.length+": "+commandQueue[0];
	spendCard();
}
function clickWait (){
	
	commandQueue[0]="Wait 5 seconds";
	hideCommandsMenu();
	ivoMenuButtons.codeText.text+=commandQueue.length+": "+commandQueue[0];
	spendCard();
}
function clickGravity (){
	
	commandQueue[0]="Reverse Ada's gravity";
	hideCommandsMenu();
	ivoMenuButtons.codeText.text+=commandQueue.length+": "+commandQueue[0];
	spendCard();
}
function showMenu() {
	ivoMenu.visible=true;
	ivoMenuButtons.addCommand.visible=true;
	ivoMenuButtons.exit.visible=true;
	ivoMenuButtons.execute.visible=true;
	ivoMenuButtons.codeText.visible=true;
}
function hideMenu() {
	ivoMenu.visible=false;
	ivoMenuButtons.addCommand.visible=false;
	ivoMenuButtons.exit.visible=false;
	ivoMenuButtons.execute.visible=false;
	ivoMenuButtons.codeText.visible=false;
}
function loadLevel(level) {	
	if (layer) {
		layer.destroy();
	}
	if (player){
		player.destroy();
	}
	if (punchcards){
		punchcards.destroy();
	}
	if (doors){
		doors.destroy();
	}
	if (exitArrow){
		exitArrow.destroy();
	}
	if (machine){
		machine.destroy();
	}
	if (spikes){
		spikes.destroy();
	}
	if (ivoMenu){
		ivoMenu.destroy();
	}
	collectedPunchcards = 0;
	spentPunchcards=0;
	map = game.add.tilemap('level-'+level);
	map.addTilesetImage('ada-tileset');
	layer = map.createLayer('Tile Layer 1');
	layer.resizeWorld();
	punchcards = game.add.group();
    punchcards.enableBody = true;
    map.createFromObjects('entities', 5, 'punchcard', 0, true, false, punchcards);
	punchcards.forEach(function(s) {
		s.body.gravity.y = 300;
		s.body.bounce.y=0.3;
	}, this);
	exitArrow=game.add.group();
	exitArrow.enableBody=true;
	map.createFromObjects('entities', 6, 'exitArrow', 0, true, false, exitArrow);
	exitArrow.forEach(function(s) {
		s.body.immovable = true;
		s.exists=false;
	}, this);
	doors=game.add.group();
	doors.enableBody=true;
	map.createFromObjects('entities', 6, 'blueDoor', 0, true, false, doors);
	doors.forEach(function(s) {
		s.body.immovable = true;
	}, this);
	spikes=game.add.group();
	spikes.enableBody=true;
	map.createFromObjects('entities', 7, 'spike', 0, true, false, spikes);
	spikes.forEach(function(s) {
		s.body.immovable = true;
	}, this);

	map.setCollisionBetween(1, 4);
	player = game.add.sprite(96, 180, 'ada');
	game.physics.arcade.enable(player);
	player.body.velocity.x=0;
	player.body.velocity.y=0;
	player.body.bounce.y = 0.2;
	player.body.gravity.y = gravity;
	player.body.collideWorldBounds = true;
	//player.body.maxVelocity.y = 500;//keep her from falling through tiles
	game.camera.follow(player);
	//player.bringToTop();//sprite was hiding behind new tilemaps being created each level.
	//player.position.setTo(32,200);
	machine = game.add.sprite(224, 180, 'ivo');
	game.physics.arcade.enable(machine);
	machine.body.collideWorldBounds = true;
	machine.body.immovable = false;
	machine.body.gravity.y = gravity-100;//ensures Ada will stick to the top of Ivo while they fall, she has more gravity.	
	machine.anchor.setTo(0.25,0);//for calculating distance between player and Ivo
	//setting up the menu and submenu for Ivo but not displaying until we need to.
	//ordered so that the later images are on top
	ivoMenu = game.add.sprite(0,0,'punchcardMenu');
	ivoMenu.visible=false;
	ivoMenuButtons.addCommand=game.add.button(15, 5, 'menuButtonAdd', clickButtonAdd);
	ivoMenuButtons.addCommand.visible=false;
	ivoMenuButtons.exit=game.add.button(15,400,'menuEject', clickEject);
	ivoMenuButtons.exit.visible=false;
	ivoMenuButtons.execute=game.add.button(15,260,'menuExecute', clickExecute);
	ivoMenuButtons.execute.visible=false;
	ivoMenuButtons.codeText = game.add.text(10,140,'code\n', {font:'40px Helvetica', fill: '#000' });
	ivoMenuButtons.codeText.visible=false;
	ivoCommandsBackground = game.add.sprite(40,0,'menuCommands');
	ivoCommandsBackground.visible=false;
	ivoMenuButtons.moveLeft=game.add.button(45,5,'menuMoveLeft', clickMoveLeft);
	ivoMenuButtons.moveLeft.visible=false;
	ivoMenuButtons.moveRight=game.add.button(45,75,'menuMoveRight', clickMoveRight);
	ivoMenuButtons.moveRight.visible=false;
	ivoMenuButtons.blueDoor=game.add.button(45,145,'menuBlueDoor',clickBlueDoor);
	ivoMenuButtons.blueDoor.visible=false;
	ivoMenuButtons.yellowDoor=game.add.button(45,215,'menuYellowDoor');
	ivoMenuButtons.yellowDoor.visible=false;
	ivoMenuButtons.repeat=game.add.button(45,285,'menuRepeat',clickRepeat);
	ivoMenuButtons.repeat.visible=false;
	ivoMenuButtons.wait=game.add.button(45,355,'menuWait',clickWait);
	ivoMenuButtons.wait.visible=false;
	ivoMenuButtons.reverseGravity=game.add.button(45,425,'menuGravity',clickGravity);
	ivoMenuButtons.reverseGravity.visible=false;
	punchcardText.text = 'Punchcards: ' + collectedPunchcards;
	//level++;
}
function spendCard(){
	collectedPunchcards--;
	spentPunchcards++;
	punchcardText.text = 'Punchcards: ' + collectedPunchcards;
}
function updateCounter() {
	timerIsRunning=false;
	timerText.text="Bam";
}
//function render() {
	//game.debug.text('Time until event: ' + timer.duration.toFixed(0), 32, 32);
    // game.debug.playerBounds(player);

    // game.debug.cameraInfo(game.camera, 32, 32);

    //game.debug.body(player);

//game.debug.bodyInfo(player, 32, 32);
//}
