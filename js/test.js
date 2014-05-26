var game = new Phaser.Game(800, 608, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });



function preload() {
    game.load.tilemap('map', 'assets/test-map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('ada-tileset', 'assets/ada-tileset.png');
    game.load.image('ada', 'assets/ada.png');
	game.load.image('blueDoor','assets/blue-door.png');
}

var map;
var layer;
var cursors;
var player;
//var door;
function create() {
    map = game.add.tilemap('map');
    map.addTilesetImage('ada-tileset');
    layer = map.createLayer('Tile Layer 1');
    layer.resizeWorld();
    map.setCollisionBetween(1, 6);//should be 6, testing
	//door=game.add.sprite(500,70,'blueDoor');
	//game.physics.enable(player);
    player = game.add.sprite(260, 70, 'ada');
    game.physics.enable(player);
    player.body.bounce.set(0.1);
    player.body.tilePadding.set(32);
    game.camera.follow(player);
    game.physics.arcade.gravity.y = 800;
    cursors = game.input.keyboard.createCursorKeys();
}

function update() {
	game.physics.arcade.collide(player, layer);
	//player.body.velocity.x = 0;
	//player.body.velocity.y = 0;

    if (cursors.up.isDown)

    {

        player.body.velocity.y = -150;

    }

    else if (cursors.down.isDown)

    {

        player.body.velocity.y = 150;

    }



    if (cursors.left.isDown)

    {

        player.body.velocity.x = -150;

    }

    else if (cursors.right.isDown)

    {

        player.body.velocity.x = 150;

    }



}



function render() {
    //  Useful debug things you can turn on to see what's happening



    // game.debug.playerBounds(player);

    // game.debug.cameraInfo(game.camera, 32, 32);

    // game.debug.body(player);

    game.debug.bodyInfo(player, 32, 32);
}
