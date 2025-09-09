function Construction() {


    this.building = -1;
    this.builds = [];


    this.init = function() {
        this.building = -1;
        this.builds = [];
        for(var bId in Building.b) {
            var b = Building.b[bId];
            this.builds.push({
                id : b.id,
                canBuild : b.hasOwnProperty("buildTex") && b.hasOwnProperty("buildCost"),
                unlocked : b.hasOwnProperty("start"),
                built : 0,
                workers : 0,
                maxWorkers : 0,
            });
        }
    };


    this.canBuildHere = function(x, y) {
        if(this.building == -1) {
            return false;
        }
        var t = map.m[x][y];
        if(t.b <= 0) {
            var b = Building.b[this.building];
            if(b.buildPlace == 1) {
                return t.bi != 8;
            } else if(b.buildPlace == 2) {
                return t.bi == 0 || t.bi == 2 || t.bi == 3 || t.bi == 4 || t.bi == 5;
            } else if(b.buildPlace == 3) {
                return t.bi == 6;
            } else if(b.buildPlace == 4) {
                return t.iN == 1;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };


    this.unlock = function(id) {
        for(var i = 0; i < this.builds.length; i++) {
            if(this.builds[i].id == id) {
                this.builds[i].unlocked = true;
            }
        }
    };


    this.hover = function() {
        var j = 0;
        for(var i = 0; i < this.builds.length; i++) {
            var bL = this.builds[i];
            if(bL.canBuild) {
                var y = (game.centerY - 250) + 60 + (Math.floor(j / 8) * 84)
                var x = (game.centerX - 350) + 18 + ((j % 8) * 84);
                if(mouse.isOver(x, y, 76, 76)) {
                    if(bL.unlocked) {
                        panel.hintType = "construct";
                        panel.hintId = bL.id;
                    } else {
                        panel.hintType = "construct";
                        panel.hintId = -1;
                    }
                }
                j++;
            }
        }
    };


    this.click = function() {
        var j = 0;
        for(var i = 0; i < this.builds.length; i++) {
            var bL = this.builds[i];
            if(bL.canBuild) {
                var y = (game.centerY - 250) + 60 + (Math.floor(j / 8) * 84)
                var x = (game.centerX - 350) + 18 + ((j % 8) * 84);
                if(bL.unlocked && mouse.isOver(x, y, 76, 76)) {
                    this.building = bL.id;
                    panel.showConstructionMenu = false;
                    sound.play("button");
                }
                j++;
            }
        }
        if(mouse.isOver(game.centerX + 260, game.centerY + 130, 72, 36)) {
            panel.showConstructionMenu = false;
            sound.play("button");
        }
    };


    this.draw = function() {

        c.fillStyle = "rgba(0, 0, 0, 0.4)";
        c.fillRect(0, 0, game.width, game.height);

        c.save();
        c.translate(game.centerX - 350, game.centerY - 250);

        panel.drawBox(0, 0, 700, 434, true, true, true, true, true);
        panel.text(18, 38, 24, "left", "Construction menu");
        panel.textGrey(18, 417, 16, "left", "Press space bar to toggle this menu.");

        var j = 0;
        for(var i = 0; i < this.builds.length; i++) {
            var bL = this.builds[i];
            if(bL.canBuild) {
                var b = Building.b[bL.id];
                var y = 60 + (Math.floor(j / 8) * 84)
                var x = 18 + ((j % 8) * 84);
                img.drawSprite("constructionBG", x, y, 76, 76, 0, 0);

                if(bL.unlocked) {
                    var downOffset = 0;
                    if(mouse.isOver((game.centerX - 350) + x, (game.centerY - 250) + y, 76, 76)) {
                        if(mouse.down) {
                            downOffset = 2;
                        }
                        img.drawSprite("constructionBG", x, y + downOffset, 76, 76, 2, 0);
                    } else {
                        img.drawSprite("constructionBG", x, y, 76, 76, 1, 0);
                    }
                    img.drawSprite("building", x + 22, y + 6 + downOffset, 32, 64, b.buildTex, 0);
                } else {
                    img.drawSprite("constructionBG", x, y, 76, 76, 0, 0);
                }
                j++;
            }
        }

        c.restore();

        panel.drawButton(game.centerX + 260, game.centerY + 130, "Cancel");
    };

};