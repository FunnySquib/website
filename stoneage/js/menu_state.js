function MenuState() {


    this.fullscreen = true;
    this.showCredits = false;
    this.startNewGame = false;
    this.startLoadGame = false;


    this.init = function() {
    };


    this.show = function() {
        var caller = this;
        mouse.registerUpArea("click", 0, 0, 10000, 10000, function() {
            if(!game.paused) {
                caller.click();
            }
        });
    };


    this.hide = function() {
        mouse.deleteUpArea("click");
    };


    this.update = function() {
        if(this.startNewGame) {
            game.setState("ingame");
        }
    };


    this.click = function() {

        if(this.startNewGame || this.startLoadGame) {
            return;
        }
        if(this.showCredits) {
            this.showCredits = false;
            return;
        }

        var mX = game.centerX;
        var mY = Math.round(game.centerY + 47 + (0.5 * (game.centerY - 50)));

        if(mouse.isOver(mX - 130, mY - 80, 120, 50)) {
            if(this.fullscreen) {
                screenfull.request(jQuery("html")[0]);
            }
            this.startNewGame = true;
        }

        if(mouse.isOver(mX + 10, mY - 80, 120, 50)) {
            if(this.fullscreen) {
                screenfull.request(jQuery("html")[0]);
            }
            Saving.openLoad();
            this.startLoadGame = true;
        }

        if(mouse.isOver(mX - 55, mY - 14, 110, 24)) {
            this.fullscreen = !this.fullscreen;
        }

        if(mouse.isOver(mX - 60, mY + 50, 120, 50)) {
            this.showCredits = true;
        }

    };


    this.draw = function() {

        var g = c.createLinearGradient(0, 0, 0, game.height);
        g.addColorStop(0, "#ccc");
        g.addColorStop(1, "#eee");

        c.fillStyle = g;
        c.fillRect(0, 0, game.width, game.height);

        if(this.startNewGame) {

            this.text(game.centerX, game.centerY + 10, 24, "center", "generating world$.$.$.", "#000");


        } else if(this.startLoadGame) {

            this.text(game.centerX, game.centerY + 10, 24, "center", "loading game$.$.$.", "#000");


        } else if(this.showCredits) {

            this.text(game.centerX, game.centerY - 200, 24, "center", "Created in 72 hours", "#000");
            this.text(game.centerX, game.centerY - 170, 24, "center", "by henry raymond", "#000");
            this.text(game.centerX, game.centerY - 140, 24, "center", "for ludum dare 36", "#000");

            this.text(game.centerX, game.centerY - 80, 24, "center", "Sound credits", "#000");
            this.text(game.centerX, game.centerY - 52, 20, "center", "Music was generated with Jukedeck", "#000");
            this.text(game.centerX, game.centerY - 28, 20, "center", "($Music from Jukedeck - create your own at http://jukedeck.com$)", "#000");
            this.text(game.centerX, game.centerY - 4, 20, "center", "LittleRobotSoundFactory on freesound.org", "#000");
            this.text(game.centerX, game.centerY + 20, 20, "center", "dland on freesound.org", "#000");
            this.text(game.centerX, game.centerY + 44, 20, "center", "Motion_S on freesound.org", "#000");
            this.text(game.centerX, game.centerY + 68, 20, "center", "UncleSigmund on freesound.org", "#000");
            this.text(game.centerX, game.centerY + 92, 20, "center", "Kodack on freesound.org", "#000");
            this.text(game.centerX, game.centerY + 116, 20, "center", "InspectorJ on freesound.org", "#000");

            this.text(game.centerX, game.centerY + 220, 20, "center", "click to return to main menu", "#666");


        } else {

            img.draw("logo", game.centerX - 400, game.centerY - 250);

            var mX = game.centerX;
            var mY = Math.round(game.centerY + 47 + (0.5 * (game.centerY - 50)));

            this.drawButton(mX - 130, mY - 80, "new game");
            this.drawButton(mX + 10, mY - 80, "load game");

            var mO = mouse.down ? 2 : 0;
            var check = this.fullscreen ? 5 : 6;

            if(mouse.isOver(mX - 55, mY - 14, 110, 24)) {
                img.drawSprite("buttons", mX - 55, (mY - 14) + mO, 24, 24, check, 1);
            } else {
                img.drawSprite("buttons", mX - 55, mY - 14, 24, 24, check, 0);
            }
            this.text(mX - 24, mY + 5, 20, "left", "fullscreen", "#000");

            this.drawButton(mX - 60, mY + 50, "credits");

        }

    };


    this.drawButton = function(x, y, text) {

        c.shadowColor = "rgba(0, 0, 0, 0.1)";
        c.shadowBlur = 15;
        c.shadowOffsetX = 0;
        c.shadowOffsetY = 2;
        c.fillStyle = "#000";
        c.fillRect(x + 2, y + 2, 116, 46);

        var mO = mouse.down ? 2 : 0;

        if(!game.paused && mouse.isOver(x, y, 120, 50)) {
            img.drawSprite("bigButton", x, y + mO, 120, 50, 0, 1);
        } else {
            img.drawSprite("bigButton", x, y, 120, 50, 0, 0);
            mO = 0;
        }

        c.shadowColor = "rgba(0, 0, 0, 1.0)";
        c.shadowBlur = 3;
        c.shadowOffsetX = 0;
        c.shadowOffsetY = 1;
        this.text(x + 60, y + mO + 34, 24, "center", text, "#fff");
        c.shadowBlur = 0;
        c.shadowOffsetY = 0;
    };


    this.text = function(x, y, size, align, text, color) {
        c.fillStyle = color;
        c.font = size + "px \"BebasNeue\"";
        c.textAlign = align;
        c.fillText(text.split(" ").join("  ").split("$").join(" "), x, y);
    };

}