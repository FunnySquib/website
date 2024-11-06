function Panel() {


    this.showMapHighlight = false;
    this.showAchievements = false;
    this.showConstructionMenu = false;

    this.hintType = "";
    this.hintText = "";
    this.hintId = 0;
    this.hintTile = { x : 0, y : 0 };

    this.numOfResShowing = 0;
    this.resRowsPerColumn = 0;
    this.numOfResColumns = 0;
    this.numOfResRows = 0;

    this.tutorialAnimation = 0.0;
    this.eventAnimation = 0.0;
    this.showingEvent = false;


    this.init = function() {

        this.showMapHighlight = false;

        this.hintType = "";
        this.hintText = "";
        this.hintId = 0;
        this.hintTile = { x : 0, y : 0 };
    };


    this.update = function() {

        if(player.stats.tutorial % 2 == 1) {
            this.tutorialAnimation = 1.0;
        } else {
            this.tutorialAnimation -= timer.delta * 0.5;
            if(this.tutorialAnimation <= 0) {
                player.stats.tutorial++;
                if(player.stats.tutorial <= 14) {
                    sound.play("tut");
                }
                if(player.stats.tutorial == 5) {
                    player.stats.showConstructionMenu = true;
                }
            }
        }
        this.eventAnimation -= timer.delta * 1.2;
        if(this.eventAnimation < 0.0) {
            this.eventAnimation = 1.0;
        }

        this.numOfResShowing = 0;
        for(var resName in player.inv) {
            if(player.inv[resName].show) {
                this.numOfResShowing++;
            }
        }
        this.resRowsPerColumn = Math.floor((game.height - 28) / 32);
        this.numOfResColumns = Math.ceil(this.numOfResShowing / this.resRowsPerColumn);
        this.numOfResRows = limit(this.numOfResShowing, 0, this.resRowsPerColumn);

        this.showMapHighlight = false;

        this.hintType = "";
        this.hintText = "";
        this.hintId = 0;
        this.hintTile = { x : 0, y : 0 };

        var x = mouse.x;
        var y = mouse.y;
        var w = game.width;
        var h = game.height;

        var resPanelW = 20 + (198 * this.numOfResColumns);
        var resPanelH = h - (26 + (32 * this.numOfResRows));
        var showRes = this.numOfResShowing > 0;

        var pO = 0;
        var eventH = this.getEventElementHeight();
        var eX = game.centerX + 110;
        var eY = 150 - 58;

        if(this.showConstructionMenu) {
            construction.hover();

        } else if(this.showAchievements) {
            achievements.hover();

        } else {
            if(x >= w - 218 && y >= h - 218) {
                this.hintType = "minimap";
                if(mouse.down) {
                    this.miniMapClick();
                }

            } else if(mouse.isOver(eX - 218, eY - 8, 216, eventH)) {
                // do nothing

            } else if(showRes && x < resPanelW && y >= resPanelH) {
                var resPos = 0;
                var resY = -14;
                var resX = 12;
                for(var resName in player.inv) {
                    if(player.inv[resName].show) {
                        resPos++;
                        if(resPos != 1 && resPos % this.resRowsPerColumn == 1) {
                            resY = -14;
                            resX += 198;
                        }
                        resY -= 32;
                        if(x >= resX - 6 && x < resX + 192 && y >= h + resY && y < h + resY + 32) {
                            this.hintType = "res";
                            this.hintText = resName;
                        }
                    }
                }

            } else if(player.stats.showPopulation && x >= w - 218 && y >= h - 314) {
                // do nothing

            } else if(player.stats.showConstructionMenu && mouse.isOver(game.width - 140, 38, 132, 88)) {
                this.hintType = "constructionButton";
                this.hintText = "Open Construction menu";

            } else if(x >= w - 120 && x < w - 96 && y >= 6 + pO && y < 30 + pO) {
                this.hintType = "tip";
                this.hintText = "Show Achievements"

            } else if(x >= w - 90 && x < w - 66 && y >= 6 + pO && y < 30 + pO) {
                this.hintType = "tip";
                this.hintText = "Save$/$load Game"

            } else if(x >= w - 60 && x < w - 36 && y >= 6 + pO && y < 30 + pO) {
                this.hintType = "tip";
                this.hintText = "Pause Game"

            } else if(x >= w - 30 && x < w - 6 && y >= 6 + pO && y < 30 + pO) {
                if(sound.muted) {
                    this.hintType = "tip";
                    this.hintText = "Unmute sound"
                } else {
                    this.hintType = "tip";
                    this.hintText = "mute sound"
                }

            } else {
                this.showMapHighlight = true;
                var tile = camera.getSelectedTile();
                if(tile.x != -1 && tile.y != -1) {
                    this.hintType = "tile";
                    this.hintTile = tile;
                }
            }
        }
    };


    this.click = function() {

        var x = mouse.x;
        var y = mouse.y;
        var w = game.width;
        var h = game.height;

        var resPanelW = 20 + (198 * this.numOfResColumns);
        var resPanelH = h - (26 + (32 * this.numOfResRows));
        var showRes = this.numOfResShowing > 0;

        var pO = 0;
        var eventH = this.getEventElementHeight();
        var eX = game.centerX + 110;
        var eY = 150 - 58;

        if(this.showConstructionMenu) {
            construction.click();

        } else if(this.showAchievements) {
            if(mouse.isOver(game.centerX + 260, game.centerY + 106, 72, 36)) {
                this.showAchievements = false;
                sound.play("button");
            }

        } else {
            if(x >= w - 218 && y >= h - 218) {
                this.miniMapClick();

            } else if(mouse.isOver(eX - 218, eY - 8, 216, eventH)) {
                // do nothing

            } else if(showRes && x < resPanelW && y >= resPanelH) {
                // do nothing

            } else if(player.stats.showPopulation && x >= w - 218 && y >= h - 314) {
                // do nothing

            } else if(player.stats.showConstructionMenu && mouse.isOver(game.width - 140, 38, 132, 88)) {
                construction.building = -1;
                if(!keyboard.isPressed(Keyboard.SHIFT)) {
                    this.showConstructionMenu = true;
                }
                sound.play("button");

            } else if(x >= w - 120 && x < w - 96 && y >= 6 + pO && y < 30 + pO) {
                this.showAchievements = true;
                sound.play("button");

            } else if(x >= w - 90 && x < w - 66 && y >= 6 + pO && y < 30 + pO) {
                Saving.openMenu();
                sound.play("button");

            } else if(x >= w - 60 && x < w - 36 && y >= 6 + pO && y < 30 + pO) {
                game.pause();
                sound.play("button");

            } else if(x >= w - 30 && x < w - 6 && y >= 6 + pO && y < 30 + pO) {
                sound.muteUnmute();
                sound.play("button");

            } else {
                var tile = camera.getSelectedTile();
                if(tile.x != -1 && tile.y != -1) {
                    player.interactWithTile(tile);
                }
            }
        }
    };


    this.getEventElementHeight = function() {
        var eventH = -6;
        if(player.stats.eventType == 1) {
            eventH += 80;
        }
        if(player.stats.eventType == 2) {
            eventH += 80;
        }
        if(player.stats.noWater) {
            eventH += 80;
        }
        if(player.stats.noFood) {
            eventH += 80;
        }
        return eventH;
    };


    this.miniMapClick = function() {
        var posOnMiniMapX = mouse.x - (game.width - 210);
        posOnMiniMapX *= map.SIZE / 200;
        var posOnMiniMapY = mouse.y - (game.height - 210);
        posOnMiniMapY *= map.SIZE / 200;
        camera.jumpToTile(posOnMiniMapX, posOnMiniMapY);
    };


    this.draw = function() {

        var showHover = !game.paused && !this.showConstructionMenu && !this.showAchievements;

        // Population

        if(player.stats.showPopulation) {
            c.fillStyle = "#000";
            c.fillRect(game.width - 2, game.height - 306, 2, 88);
            this.drawBox(game.width - 210, game.height - 306, 200, 88, true, true, true, true, true);

            this.text(game.width - 198, game.height - 280, 17, "left", "population:");
            this.text(game.width - 22, game.height - 279, 20, "right", panel.toNum(player.stats.population, 0));

            this.text(game.width - 198, game.height - 256, 17, "left", "max. population:");
            this.text(game.width - 22, game.height - 255, 20, "right", panel.toNum(player.stats.maxPopulation, 0));

            this.text(game.width - 198, game.height - 232, 17, "left", "Idle laborers:");
            this.text(game.width - 22, game.height - 231, 20, "right", panel.toNum(player.stats.idleLaborers, 0));
        }

        // Minimap

        c.save();
        c.translate(game.width - 210, game.height - 210);

        c.shadowColor = "rgba(0, 0, 0, 0.75)";
        c.shadowBlur = 15;
        c.shadowOffsetX = 0;
        c.shadowOffsetY = 2;
        c.fillStyle = "#000";
        c.fillRect(-8, -8, 240, 240);
        c.shadowBlur = 0;
        c.shadowOffsetY = 0;

        img.draw("miniMap", 0, 0);

        var view = camera.getMiniMapCorners();
        c.strokeStyle = "#fff";
        c.lineWidth = 2.0;
        c.strokeRect(view.startX, view.startY, view.endX - view.startX, view.endY - view.startY);
        c.lineWidth = 1.0;

        img.draw("minimapShadow", 0, 0);
        this.drawBox(0, 0, 200, 200, true, true, true, true, false);

        c.restore();

        // Building Menu Button

        if(player.stats.showConstructionMenu) {
            var bmbO = 0;
            if(showHover && mouse.isOver(game.width - 140, 38, 132, 88)) {
                bmbO = 1;
            }
            c.shadowColor = "rgba(0, 0, 0, 0.75)";
            c.shadowBlur = 15;
            c.shadowOffsetX = 0;
            c.shadowOffsetY = 2;
            c.fillStyle = "#000";
            c.fillRect(game.width - 138, 38, 130, 88);
            c.shadowBlur = 0;
            c.shadowOffsetY = 0;
            img.drawSprite("buildMenuButton", game.width - 140, 38, 44, 88, bmbO, 0);
            img.drawSprite("buildMenuButtonBG", game.width - 88, 46, 72, 72, bmbO, 0);
            this.drawBox(game.width - 88, 46, 72, 72, true, true, true, true, false);
            if(construction.building != -1) {
                img.drawSprite("building", game.width - 68, 50, 32, 64, Building.b[construction.building].buildTex, 0);
            }
        }

        // Res

        if(this.numOfResShowing > 0) {
            c.save();
            c.translate(0, game.height);
            this.drawBox(0, (-32 * this.numOfResRows) - 18, 12 + (198 * this.numOfResColumns), 8 + (32 * this.numOfResRows), true, true, true, false, true);
            var resPos = 0;
            var resY = -14;
            var resX = 12;
            for(var resName in player.inv) {
                if(player.inv[resName].show) {
                    resPos++;
                    if(resPos != 1 && resPos % this.resRowsPerColumn == 1) {
                        resY = -14;
                        resX += 198;
                    }
                    resY -= 32;
                    var resV = player.inv[resName];
                    img.drawSprite("res", resX, resY + 8, 16, 16, Res.res[resName].tO, 0);
                    this.text(resX + 96, resY + 23, 20, "right", this.toNum(player.inv[resName].amount, 0));
                    var mult = resV.multiplier * player.stats.prodMultiplier;
                    var totalProd = (resV.prodPlus * mult) - (resV.prodMinus + resV.baseMinus);
                    if(totalProd > 0.0099) {
                        this.textGreen(resX + 186, resY + 22, 17, "right", "+" + this.toNum(totalProd, 1) + "/sec");
                    } else if(totalProd < -0.0099) {
                        this.textRed(resX + 186, resY + 22, 17, "right", "-" + this.toNum(-totalProd, 1) + "/sec");
                    } else {
                        this.text(resX + 186, resY + 22, 17, "right", "+0.0/sec");
                    }
                }
            }
            c.restore();
        }

        // Buttons

        var pO = 0;

        c.save();
        c.translate(game.width - 120, 6 + pO);

        c.shadowColor = "rgba(0, 0, 0, 0.75)";
        c.shadowBlur = 15;
        c.shadowOffsetX = 0;
        c.shadowOffsetY = 2;
        c.fillStyle = "#000";
        c.fillRect(2, 2, 20, 20);
        c.fillRect(32, 2, 20, 20);
        c.fillRect(62, 2, 20, 20);
        c.shadowBlur = 0;
        c.shadowOffsetY = 0;

        var mO = mouse.down ? 2 : 0;

        if(showHover && mouse.isOver(game.width - 120, 6 + pO, 24, 24)) {
            img.drawSprite("buttons", 0, mO, 24, 24, 0, 1);
        } else {
            img.drawSprite("buttons", 0, 0, 24, 24, 0, 0);
        }
        if(showHover && mouse.isOver(game.width - 90, 6 + pO, 24, 24)) {
            img.drawSprite("buttons", 30, mO, 24, 24, 1, 1);
        } else {
            img.drawSprite("buttons", 30, 0, 24, 24, 1, 0);
        }
        if(showHover && mouse.isOver(game.width - 60, 6 + pO, 24, 24)) {
            img.drawSprite("buttons", 60, mO, 24, 24, 2, 1);
        } else {
            img.drawSprite("buttons", 60, 0, 24, 24, 2, 0);
        }
        if(sound.muted) {
            if(showHover && mouse.isOver(game.width - 30, 6 + pO, 24, 24)) {
                img.drawSprite("buttons", 90, mO, 24, 24, 4, 1);
            } else {
                img.drawSprite("buttons", 90, 0, 24, 24, 4, 0);
            }
        } else {
            if(showHover && mouse.isOver(game.width - 30, 6 + pO, 24, 24)) {
                img.drawSprite("buttons", 90, mO, 24, 24, 3, 1);
            } else {
                img.drawSprite("buttons", 90, 0, 24, 24, 3, 0);
            }
        }

        c.restore();

        // Tutorial

        if(player.stats.tutorial <= 14) {

            c.globalAlpha = limit((this.tutorialAnimation * 1.25) - 0.25, 0.0, 1.0);

            if(player.stats.tutorial == 1 || player.stats.tutorial == 2) {
                this.drawBox(game.centerX - 180, game.height - 210, 360, 106, true, true, true, true, true);
                this.text(game.centerX, game.height - 182, 20, "center", "use the following keys to move around:");
                img.draw("tutorial", game.centerX - 200, game.height - 184);

            } else if(player.stats.tutorial == 3 || player.stats.tutorial == 4) {
                var tutY = (game.height - 32) - (32 * this.numOfResRows);
                this.drawBox(20, tutY - 218, 300, 206, true, true, true, true, true);
                this.text(170, tutY - 190, 20, "center", "Now, let's collect some resources:");
                this.text(36, tutY - 156, 20, "left", "40 Wood");
                this.textGrey(112, tutY - 157, 17, "left", "by clicking on trees");
                this.text(36, tutY - 130, 20, "left", "80 Food");
                this.textGrey(112, tutY - 131, 17, "left", "by clicking on fruit trees");
                this.text(36, tutY - 104, 20, "left", "80 Water");
                this.textGrey(112, tutY - 105, 17, "left", "by clicking on rivers and lakes");

                this.text(170, tutY - 71, 17, "center", "The collected resources will appear here");
                img.drawSprite("arrows", 90, tutY - 56, 32, 32, 0, 0);

            } else if(player.stats.tutorial == 5 || player.stats.tutorial == 6) {
                this.drawBox(game.width - 368, 46, 206, 116, true, true, true, true, true);
                this.text(game.width - 210, 74, 20, "right", "Now, open the");
                this.text(game.width - 210, 98, 20, "right", "construction menu.");
                this.text(game.width - 210, 122, 20, "right", "Select the mud hut");
                this.text(game.width - 210, 146, 20, "right", "and build one.");
                img.drawSprite("arrows", game.width - 200, 68, 32, 32, 1, 0);

            } else if(player.stats.tutorial == 7 || player.stats.tutorial == 8) {
                this.drawBox(game.width - 480, game.height - 306, 246, 154, true, true, true, true, true);
                this.text(game.width - 282, game.height - 278, 20, "right", "You increased the");
                this.text(game.width - 282, game.height - 254, 20, "right", "max. population by 2.");
                this.text(game.width - 464, game.height - 216, 20, "left", "Now click twice on the");
                this.text(game.width - 464, game.height - 192, 20, "left", "mud hut that you just built");
                this.text(game.width - 464, game.height - 168, 20, "left", "to create two laborers.");
                img.drawSprite("arrows", game.width - 274, game.height - 290, 32, 32, 1, 0);

            } else if(player.stats.tutorial == 9 || player.stats.tutorial == 10) {
                this.drawBox(game.width - 448, 16, 286, 132, true, true, true, true, true);
                this.text(game.width - 432, 46, 20, "left", "Your laborers are consuming");
                this.text(game.width - 432, 70, 20, "left", "food and water.");
                this.text(game.width - 210, 108, 20, "right", "Build a water hole and");
                this.text(game.width - 210, 132, 20, "right", "a Gatherer's hut.");
                img.drawSprite("arrows", game.width - 200, 96, 32, 32, 1, 0);

            } else if(player.stats.tutorial == 11 || player.stats.tutorial == 12) {
                this.drawBox(game.centerX - 200, game.height - 254, 400, 130, true, true, true, true, true);
                this.text(game.centerX - 184, game.height - 226, 20, "left", "Click once on the water hole to assign");
                this.text(game.centerX - 184, game.height - 202, 20, "left", "one laborer to water production.");
                this.text(game.centerX + 184, game.height - 164, 20, "right", "Click once on the gatherer's hut to assign");
                this.text(game.centerX + 184, game.height - 140, 20, "right", "one laborer to food production.");

            } else if(player.stats.tutorial == 13 || player.stats.tutorial == 14) {
                this.drawBox(game.centerX - 220, game.height - 282, 440, 158, true, true, true, true, true);
                this.text(game.centerX - 204, game.height - 254, 20, "left", "Produce more resources$!");
                this.text(game.centerX + 204, game.height - 216, 20, "right", "Turn your settlement into a town$!");
                this.text(game.centerX - 204, game.height - 178, 20, "left", "Build a golden statue for the gods$!");
                this.text(game.centerX + 204, game.height - 140, 20, "right", "Unlock as many achievements as you can$!");
            }
            c.globalAlpha = 1.0;
        }

        // Achievement screen

        if(this.showAchievements) {
            achievements.drawScreen();
        }

        // construction menu

        if(this.showConstructionMenu) {
            construction.draw();
        }

        // Hint

        if(this.hintType != "" && player.stats.tutorial != 1) {

            c.save();
            c.translate(game.centerX, game.height);

            if(this.hintType == "tile") {
                var content = Building.getHintContent(this.hintTile);
                var off = 22 * content.lines;
                this.drawBox(-140, -36 - off, 280, 36 + off, true, true, false, true, true);
                this.text(0, -11 - off, 20, "center", content.title);
                if(content.lines >= 1) {
                    this.textGrey(0, 11 - off, 16, "center", content.line1);
                }
                if(content.lines >= 2) {
                    this.textGrey(0, 33 - off, 16, "center", content.line2);
                }
                if(content.lines >= 3) {
                    this.textGrey(0, 55 - off, 16, "center", content.line3);
                }

            } else if(this.hintType == "res") {
                var resDek = Res.res[this.hintText];
                var resInv = player.inv[this.hintText];
                var manH = 0;
                if(resInv.manualProd > 0) {
                    manH = 22;
                }
                this.drawBox(-112, -58 - manH, 224, 58 + manH, true, true, false, true, true);
                this.text(-100, -33 - manH, 20, "left", resDek.name);
                if(resInv.manualProd > 0) {
                    this.textGrey(-100, -33, 16, "left", "gathered manually: " + this.toNum(resInv.manualProd, 0));
                }
                this.textGrey(-100, -11, 16, "left", "Total produced: " + this.toNum(resInv.totalProd, 0));

            } else if(this.hintType == "tip") {
                this.drawBox(-96, -36, 192, 36, true, true, false, true, true);
                this.text(0, -11, 20, "center", this.hintText);

            } else if(this.hintType == "constructionButton") {
                this.drawBox(-116, -58, 232, 58, true, true, false, true, true);
                this.text(0, -33, 20, "center", this.hintText);
                this.textGrey(0, -11, 16, "center", "Shift + click to cancel construction");

            } else if(this.hintType == "achi") {

                var title = "Locked achievement";
                var desc = "?$?$?";
                var achiID = -1;
                if(this.hintText != "") {
                    var aD = Achievements.a[this.hintText];
                    title = "ACHIEVEMENT: \"" + aD.title + "\"";
                    desc = aD.desc;
                    achiID = aD.o;
                }
                this.drawBox(-190, -58, 380, 58, true, true, false, true, true);
                if(achiID == -1) {
                    img.drawSprite("achiBox", -178, -49, 40, 40, 0, 0);
                } else {
                    img.drawSprite("achiBox", -178, -49, 40, 40, 2, 0);
                    img.drawSprite("achievements", -174, -45, 32, 32, achiID, 0);
                }
                this.text(-130, -33, 20, "left", title);
                this.textGrey(-130, -11, 16, "left", desc);

            } else if(this.hintType == "construct") {

                var title = "Locked building";
                var desc1 = "";
                var desc2 = "";
                var desc3 = "";
                var height = 36;
                if(this.hintId != -1) {
                    var b = Building.b[this.hintId];
                    title = b.name;
                    if(b.hasOwnProperty("houses")) {
                        desc1 = "Houses " + b.houses + " people";
                    }
                    if(b.hasOwnProperty("prod") && b.hasOwnProperty("workers")) {
                        var prod = "";
                        for(var resProd in b.prod) {
                            prod += b.prod[resProd] + " " + Res.res[resProd].name + "$/$sec";
                        }
                        desc1 = "Produces " + prod + " per laborer  ($max. " + b.workers + " laborers$)";
                    }
                    if(b.hasOwnProperty("convFrom") && b.hasOwnProperty("convTo") && b.hasOwnProperty("workers")) {
                        var prod = "";

                        for(var rId in b.convTo) {
                            prod += b.convTo[rId] + " " + Res.res[rId].name + "$/$sec";
                        }
                        prod += " from ";
                        var z = 0;
                        for(var rId in b.convFrom) {
                            if(z > 0) {
                                prod += " and ";
                            }
                            prod += b.convFrom[rId] + " " + Res.res[rId].name;
                            z++;
                        }
                        desc1 = "Produces " + prod + "  ($max. " + b.workers + " laborers$)";
                    }
                    if(b.hasOwnProperty("special")) {
                        desc1 = Building.getSpecialText(b.special);
                    }
                    desc2 = Building.getCostText(b.buildCost);
                    if(b.buildPlace == 1) {
                        desc3 = "Can be built anywhere but on water.";
                    } else if(b.buildPlace == 2) {
                        desc3 = "Can be built anywhere where trees grow.";
                    } else if(b.buildPlace == 3) {
                        desc3 = "Can only be built on a mountain.";
                    } else if(b.buildPlace == 4) {
                        desc3 = "Can only be built adjacent to water.";
                    }
                    height = 102;
                }
                if(height == 36) {
                    this.drawBox(-216, -36, 432, 36, true, true, false, true, true);
                    this.text(0, -11, 20, "center", title);
                } else {
                    this.drawBox(-216, -102, 432, 102, true, true, false, true, true);
                    this.text(0, -77, 20, "center", title);
                    this.textGrey(0, -55, 16, "center", desc1);
                    this.textGrey(0, -33, 16, "center", desc2);
                    this.textGrey(0, -11, 16, "center", desc3);
                }

            } else if(this.hintType == "minimap") {
                this.drawBox(-100, -58, 200, 58, true, true, false, true, true);
                this.text(0, -33, 20, "center", "Minimap");
                this.textGrey(0, -11, 16, "center", "Click to jump to this position.");

            }

            c.restore();
        }

        // Achievement popup

        achievements.draw();

        // Events

        c.fillStyle = "#000";
        var eventTitles = [];
        var eventDescs = [];

        if(player.stats.eventType == 1) {
            eventTitles.push("Disease outbreak");
            eventDescs.push("People are dying!");
        }
        if(player.stats.eventType == 2) {
            eventTitles.push("A blessing from the gods");
            eventDescs.push("clicks multiplied by 20");
        }
        if(player.stats.noWater) {
            eventTitles.push("There is no water left");
            eventDescs.push("People are dying!");
        }
        if(player.stats.noFood) {
            eventTitles.push("There is no food left");
            eventDescs.push("People are dying!");
        }
        if(eventTitles.length > 0) {
            if(!this.showingEvent) {
                this.eventAnimation = 0.0;
                this.showingEvent = true;
                if(player.stats.eventType == 2) {
                    sound.play("good_event");
                } else {
                    sound.play("bad_event");
                }
            }
        } else {
            this.showingEvent = false;
        }

        var eX = game.centerX + 110;
        var eY = 150;
        for(var i = 0; i < eventTitles.length; i++) {
            this.drawBox(eX - 210, eY - 58, 200, 58, true, true, true, true, true);
            c.globalAlpha = limit(this.eventAnimation, 0.0, 1.0);
            c.lineWidth = 8;
            c.strokeStyle = "#fc0";
            c.strokeRect(eX - 214, eY - 62, 208, 66);
            c.lineWidth = 1;
            c.globalAlpha = 1.0;
            if(eventDescs[i] == "People are dying!") {
                this.textRed(eX - 110, eY - 33, 20, "center", eventTitles[i]);
            } else {
                this.textGreen(eX- 110, eY - 33, 20, "center", eventTitles[i]);
            }
            this.textGrey(eX - 110, eY - 11, 16, "center", eventDescs[i]);
            eY -= 80;
        }
    };


    this.toNum = function(num, toFixed) {
        if(toFixed == 0) {
            return num.toFixed(0).replace(/./g, function(c, i, a) {
                return i && ((a.length - i) % 3 === 0) ? "," + c : c;
            });
        } else if(toFixed == 1) {
            return num.toFixed(1).replace(/./g, function(c, i, a) {
                return i && c !== "." && (((a.length + 1) - i) % 3 === 0) ? "," + c : c;
            });
        } else if(toFixed == 2) {
            return num.toFixed(2).replace(/./g, function(c, i, a) {
                return i && c !== "." && ((a.length - i) % 3 === 0) ? "," + c : c;
            });
        }
    };


    this.drawButton = function(x, y, text) {

        c.shadowColor = "rgba(0, 0, 0, 0.75)";
        c.shadowBlur = 15;
        c.shadowOffsetX = 0;
        c.shadowOffsetY = 2;
        c.fillStyle = "#000";
        c.fillRect(x + 2, y + 2, 68, 32);

        var mO = mouse.down ? 2 : 0;

        if(!game.paused && mouse.isOver(x, y, 72, 36)) {
            img.drawSprite("button", x, y + mO, 72, 36, 0, 1);
        } else {
            img.drawSprite("button", x, y, 72, 36, 0, 0);
            mO = 0;
        }

        c.shadowColor = "rgba(0, 0, 0, 1.0)";
        c.shadowBlur = 3;
        c.shadowOffsetX = 0;
        c.shadowOffsetY = 1;
        this.text(x + 36, y + mO + 25, 20, "center", text);
        c.shadowBlur = 0;
        c.shadowOffsetY = 0;
    };


    this.text = function(x, y, size, align, text) {
        c.fillStyle = "#fff";
        c.font = size + "px \"BebasNeue\"";
        c.textAlign = align;
        c.fillText(text.split(" ").join("  ").split("$").join(" "), x, y);
    };


    this.textGrey = function(x, y, size, align, text) {
        c.fillStyle = "#999";
        c.font = size + "px \"BebasNeue\"";
        c.textAlign = align;
        c.fillText(text.split(" ").join("  ").split("$").join(" "), x, y);
    };


    this.textGreen = function(x, y, size, align, text) {
        c.fillStyle = "#0c0";
        c.font = size + "px \"BebasNeue\"";
        c.textAlign = align;
        c.fillText(text.split(" ").join("  ").split("$").join(" "), x, y);
    };


    this.textRed = function(x, y, size, align, text) {
        c.fillStyle = "#e00";
        c.font = size + "px \"BebasNeue\"";
        c.textAlign = align;
        c.fillText(text.split(" ").join("  ").split("$").join(" "), x, y);
    };


    this.drawBox = function(x, y, w, h, top, right, bottom, left, back) {

        if(back) {
            c.shadowColor = "rgba(0, 0, 0, 0.75)";
            c.shadowBlur = 15;
            c.shadowOffsetX = 0;
            c.shadowOffsetY = 2;
            c.fillStyle = "#000";
            c.fillRect(x - 8, y - 8, w + 16, h + 16);
            c.shadowBlur = 0;
            c.shadowOffsetY = 0;
            img.drawSprite("boxBG", x, y, w, h, 0, 0);
        }

        c.fillStyle = "rgba(0, 0, 0, 0.75)";
        if(top) {
            img.drawSprite("boxHori", x - 8, y - 8, w + 16, 8, 0, 0);
            if(left) {
                c.fillRect(x + 2, y - 8, 2, 8);
            }
            if(right) {
                c.fillRect(x + w - 4, y - 8, 2, 8);
            }
            if(back) {
                c.fillRect(x + 2, y, w, 2);
            }
        }
        if(right) {
            img.drawSprite("boxVert", x + w, y - 8, 8, h + 16, 0, 0);
            if(top) {
                c.fillRect(x + w, y + 2, 8, 2);
            }
            if(bottom) {
                c.fillRect(x + w, y + h - 4, 8, 2);
            }
            if(back) {
                c.fillRect(x + w - 2, y + 2, 2, h);
            }
        }
        if(bottom) {
            img.drawSprite("boxHori", x - 8, y + h, w + 16, 8, 0, 0);
            if(left) {
                c.fillRect(x + 2, y + h, 2, 8);
            }
            if(right) {
                c.fillRect(x + w - 4, y + h, 2, 8);
            }
            if(back) {
                c.fillRect(x + 2, y + h - 2, w, 2);
            }
        }
        if(left) {
            img.drawSprite("boxVert", x - 8, y - 8, 8, h + 16, 0, 0);
            if(top) {
                c.fillRect(x - 8, y + 2, 8, 2);
            }
            if(bottom) {
                c.fillRect(x - 8, y + h - 4, 8, 2);
            }
            if(back) {
                c.fillRect(x, y + 2, 2, h);
            }
        }
        if(left && top) {
            c.fillRect(x, y, 4, 4);
            img.draw("boxCorner", x - 10, y - 10);
        }
        if(top && right) {
            c.fillRect(x + w - 4, y, 4, 4);
            img.draw("boxCorner", x + w - 2, y - 10);
        }
        if(right && bottom) {
            c.fillRect(x + w - 4, y + h - 4, 4, 4);
            img.draw("boxCorner", x + w - 2, y + h - 2);
        }
        if(bottom && left) {
            c.fillRect(x, y + h - 4, 4, 4);
            img.draw("boxCorner", x - 10, y + h - 2);
        }
    };

}