function IngameState() {


    this.loadFile = null;


    this.init = function() {

    };


    this.show = function() {

        map = new Map();
        map.init();

        camera = new Camera();
        camera.init();

        panel = new Panel();
        panel.init();

        achievements = new Achievements();
        achievements.init();

        construction = new Construction();
        construction.init();

        player = new Player();
        player.init();

        mouse.registerUpArea("click", 0, 0, 10000, 10000, function() {
            if(!game.paused && !Saving.open) {
                panel.click();
            }
        });

        keyboard.registerKeyUpHandler(Keyboard.SPACE_BAR, function() {
            if(player.stats.showConstructionMenu) {
                panel.showConstructionMenu = !panel.showConstructionMenu;
                if(panel.showConstructionMenu) {
                    construction.building = -1;
                }
            }
        });

        if(this.loadFile != null) {
            this.loadFromFile();
        }

        sound.play("music", { loops : 100000 })
    };


    this.hide = function() {
        mouse.deleteUpArea("click");
    };


    this.loadFromFile = function() {
        map.m = this.loadFile.map;
        map.viewRadius = this.loadFile.playerStats.viewRadius;
        map.ani = 0.0;
        map.updateMiniMapCountdown = 20.0;
        map.resourceSpawn = 0.0;
        map.generateMiniMap();

        player = new Player();
        player.init();
        player.inv = this.loadFile.playerInv;
        player.stats = this.loadFile.playerStats;

        camera.precisionX = player.stats.cameraX;
        camera.precisionY = player.stats.cameraY;
        camera.x = player.stats.cameraX;
        camera.y = player.stats.cameraY;
        camera.v = { x : 0, y : 0 };

        achievements = new Achievements();
        achievements.init();
        achievements.state = this.loadFile.achievements;

        construction.building = -1;
        construction.builds = this.loadFile.construction;

        panel = new Panel();
        panel.init();

        this.loadFile = null;
    };


    this.update = function() {
        if(this.loadFile != null) {
            this.loadFromFile();
        }
        if(!game.paused) {
            timer.updateCallbacks();
            player.update();
            panel.update();
            camera.update();
            map.update();
        }
    };


    this.draw = function() {

        c.fillStyle = "#000";
        c.fillRect(0, 0, game.width, game.height);

        camera.apply();
        map.draw();
        player.draw();
        camera.restore();

        panel.draw();

        //map.drawDebug()

    };

}
