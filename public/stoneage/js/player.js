function Player() {

    this.inv;
    this.stats;

    this.particles = {};
    this.particleCounter = 0;

    this.beeps = {};
    this.beepCounter = 0;
    this.beepCountdowns = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
    this.tutCountdown = 10;


    this.init = function() {

        this.inv = {};
        for(var res in Res.res) {
            this.inv[res] = {
                amount : 0,
                prodPlus : 0,
                prodMinus : 0,
                baseMinus : 0,
                show : false,
                manualProd : 0,
                totalProd : 0,
                multiplier : 1.0,
            };
        }

        this.stats = {
            manualClick : 0,
            cameraX : 0,
            cameraY : 0,
            viewRadius : map.viewRadius,
            showConstructionMenu : false,
            showPopulation : false,
            population : 0,
            maxPopulation : 0,
            idleLaborers : 0,
            clickMultiplier : 1.0,
            prodMultiplier : 1.0,
            eventCountdown : 480.0,
            eventTimer : 0.0,
            eventType : 0,
            noFood : 0,
            noWater : 0,
            killingTimer : 0.0,
            survivedOutbreak : false,
            producedIronOre : false,
            producedGold : false,
            tutorial : 1
        };
    };


    this.update = function() {

        this.stats.eventCountdown -= timer.delta;

        if(this.stats.eventType != 0) {
            if(this.stats.eventCountdown <= 0.0) {
                if(this.stats.eventType == 1) {
                    if(!this.stats.survivedOutbreak) {
                        achievements.fireAchievement("outbreak");
                        this.stats.survivedOutbreak = true;
                    }
                } else if(this.stats.eventType == 2) {
                    this.stats.clickMultiplier /= 20.0;
                }
                this.stats.eventType = 0;
                this.stats.eventCountdown = randFloat(120.0, 240.0);
            } else if(this.stats.eventType == 1) {
                this.stats.eventTimer += timer.delta;
                while(this.stats.eventTimer > 0.2) {
                    this.stats.eventTimer -= 0.2;
                    this.killMen();
                }
            }

        } else if(this.stats.eventCountdown <= 0.0) {
            this.stats.eventType = rand(1, 2);
            if(this.stats.eventType == 2) {
                this.stats.clickMultiplier *= 20.0;
            }
            this.stats.eventCountdown = 10.0;
            this.stats.eventTimer = 0.0;
        }


        for(var resId in this.inv) {
            var res = this.inv[resId];
            res.prodPlus = 0;
            res.prodMinus = 0;
        }

        for(var i = 0; i < construction.builds.length; i++) {
            var bL = construction.builds[i];
            var b = Building.b[bL.id];
            if(b.hasOwnProperty("prod")) {
                for(var resProd in b.prod) {
                    this.inv[resProd].prodPlus += b.prod[resProd] * bL.workers;
                }
            }
            if(b.hasOwnProperty("convTo")) {
                for(var resProd in b.convTo) {
                    var produceFactor = 1.0;
                    for(var resCons in b.convFrom) {
                        var cons = b.convFrom[resCons] * bL.workers * this.stats.prodMultiplier;
                        var consFactor = 1.0;
                        if(this.inv[resCons].amount == 0.0 && cons > 0 && cons > this.inv[resCons].prodPlus) {
                            consFactor = this.inv[resCons].prodPlus / cons;
                        }
                        if(consFactor < produceFactor) {
                            produceFactor = consFactor;
                        }
                    }
                    this.inv[resProd].prodPlus += b.convTo[resProd] * bL.workers * produceFactor;
                    for(var resCons in b.convFrom) {
                        this.inv[resCons].prodMinus += b.convFrom[resCons] * bL.workers * this.stats.prodMultiplier * produceFactor;
                    }
                }
            }
        }

        this.stats.noWater = false;
        this.stats.noFood = false;

        for(var resId in this.inv) {
            var res = this.inv[resId];
            var mult = res.multiplier * this.stats.prodMultiplier;
            var totalProd = (res.prodPlus * mult) - (res.prodMinus + res.baseMinus);
            res.amount += totalProd * timer.delta;
            if(res.amount < 0.0) {
                res.amount = 0.0;
                if(resId == "wate") {
                    this.stats.noWater = true;
                } else if(resId == "food") {
                    this.stats.noFood = true;
                }
            }
            var beforeProd = res.totalProd;
            res.totalProd += res.prodPlus * timer.delta;
            achievements.checkProd(resId, beforeProd, res.totalProd);
            if(res.totalProd > 0.0) {
                res.show = true;
                if(resId == "iror" && !this.stats.producedIronOre) {
                    achievements.fireAchievement("iron");
                    this.stats.producedIronOre = true;
                } else if(resId == "gold" && !this.stats.producedGold) {
                    achievements.fireAchievement("gold");
                    this.stats.producedGold = true;
                }
            }
        }

        if(this.stats.noWater || this.stats.noFood) {
            this.stats.killingTimer += timer.delta;
            while(this.stats.killingTimer > 0.2) {
                this.stats.killingTimer -= 0.2;
                this.killMen();
            }
        }

        for(var i = 0; i < this.beepCountdowns.length; i++) {
            if(this.beepCountdowns[i] > 0.0) {
                this.beepCountdowns[i] -= timer.delta;
                if(this.beepCountdowns[i] <= 0.0) {
                    this.beepCountdowns[i] = 0.0;
                }
            }
        }

        if(this.stats.tutorial == 3 && this.inv.wate.amount >= 80 && this.inv.food.amount >= 80 && this.inv.wood.amount >= 40) {
            this.stats.tutorial = 4;
        }
        if(this.stats.tutorial == 7 && this.stats.population >= 2) {
            this.stats.tutorial = 8;
        }
        if(this.stats.tutorial == 9 && construction.builds[29].built > 0 && construction.builds[32].built > 0) {
            this.stats.tutorial = 10;
        }
        if(this.stats.tutorial == 11 && construction.builds[29].workers > 0 && construction.builds[32].workers > 0) {
            this.stats.tutorial = 12;
            this.tutCountdown = 10;
        }
        if(this.stats.tutorial == 13) {
            this.tutCountdown -= timer.delta;
            if(this.tutCountdown <= 0.0) {
                this.stats.tutorial = 14;
            }
        }
    };


    this.killMen = function() {
        if(zeroOrOne(0.4) && this.stats.population > 0) {
            var num = Math.ceil(this.stats.population * randFloat(0.0015, 0.0035));
            for(var i = 0; i < num; i++) {
                var hasIdle = (this.stats.idleLaborers > 0);
                var hasNonIdle = ((this.stats.population - this.stats.idleLaborers) > 0);
                var killType = 0;
                if(hasNonIdle) {
                    if(hasIdle) {
                        killType = rand(0, 1);
                    } else {
                        killType = 1;
                    }
                }
                this.stats.population--;
                this.inv.food.baseMinus -= 0.4;
                this.inv.wate.baseMinus -= 0.4;
                if(killType == 0) {
                    this.stats.idleLaborers--;
                } else {
                    var hasKill = false;
                    var tries = 0;
                    while(!hasKill && tries < 10000) {
                        var randJob = rand(0, construction.builds.length - 1);
                        if(construction.builds[randJob].workers > 0) {
                            construction.builds[randJob].workers--;
                            hasKill = true;
                        }
                        tries++;
                    }
                }
            }
        }
    };


    this.increaseView = function() {
        map.viewRadius += 2;
        this.stats.viewRadius = map.viewRadius;
        map.updateVisible();
    };


    this.interactWithTile = function(tilePos) {
        var t = map.m[tilePos.x][tilePos.y];
        if(t.w > 0) {
            this.gatherRes(tilePos, "wate", this.stats.clickMultiplier);

        } else if(t.b > 0) {
            var b = Building.b[t.b];
            if(b.hasOwnProperty("regrowTo")) {
                sound.play("no_build");
            }
            if(b.hasOwnProperty("clickRes")) {
                for(var i = 0; i < b.clickRes.length; i++) {
                    var prod = b.clickRes[i];
                    this.gatherRes(tilePos, prod.res, prod.num * this.stats.clickMultiplier);
                }
                if(b.hasOwnProperty("removeOnRes")) {
                    t.b = -1;
                    t.bT = -1;
                }
                if(b.hasOwnProperty("changeOnRes")) {
                    t.b = b.changeOnRes[0];
                    t.bT = b.changeOnRes[1];
                }
            }
            if(b.hasOwnProperty("buildCost")) {
                if(keyboard.isPressed(Keyboard.SHIFT)) {
                    if(b.hasOwnProperty("workers")) {
                        var rem = Building.removeWorker(b.id, this.stats.clickMultiplier);
                        if(rem > 0) {
                            sound.play("min_pers", { volume : 20 });
                            this.doBeep(tilePos.x, tilePos.y, 6, rem);
                            this.stats.idleLaborers += rem;
                        }
                    }
                } else if(keyboard.isPressed(Keyboard.X)) {
                    t.b = -1;
                    t.bT = -1;
                    sound.play("ex_build");
                    Building.destroyEffect(tilePos.x, tilePos.y, b);
                } else {
                    if(b.hasOwnProperty("houses")) {
                        if(this.inv.food.amount < 5) {
                            this.doBeep(tilePos.x, tilePos.y, 1, 0);
                            sound.play("no_pers", { volume : 20 });
                        } else if(this.stats.population >= this.stats.maxPopulation) {
                            this.doBeep(tilePos.x, tilePos.y, 3, 0);
                            sound.play("no_pers", { volume : 20 });
                        } else {
                            var numOfP = this.stats.clickMultiplier;
                            if(this.inv.food.amount < numOfP * 5) {
                                numOfP = Math.floor(this.inv.food.amount / 5);
                            }
                            if(numOfP > this.stats.maxPopulation - this.stats.population) {
                                numOfP = this.stats.maxPopulation - this.stats.population;
                            }
                            var beforePop = this.stats.population;
                            this.inv.food.amount -= 5 * numOfP;
                            this.stats.population += numOfP;
                            this.stats.idleLaborers += numOfP;
                            this.inv.food.baseMinus += 0.4 * numOfP;
                            this.inv.wate.baseMinus += 0.4 * numOfP;
                            sound.play("pers", { volume : 20 });
                            this.doBeep(tilePos.x, tilePos.y, 4, numOfP);
                            achievements.checkPopulation(beforePop, this.stats.population);
                        }
                    } else if(b.hasOwnProperty("workers")) {
                        if(this.stats.idleLaborers <= 0) {
                            sound.play("no_pers", { volume : 20 });
                            this.doBeep(tilePos.x, tilePos.y, 7, 0)
                        } else {
                            var numOfWorkers = this.stats.clickMultiplier;
                            if(numOfWorkers > this.stats.idleLaborers) {
                                numOfWorkers = this.stats.idleLaborers;
                            }
                            var add = Building.addWorker(b.id, numOfWorkers);
                            if(add <= 0) {
                                sound.play("no_pers", { volume : 20 });
                                this.doBeep(tilePos.x, tilePos.y, 8, 0);
                            } else {
                                sound.play("pers", { volume : 20 });
                                this.doBeep(tilePos.x, tilePos.y, 5, add);
                                this.stats.idleLaborers -= add;
                            }
                        }
                    }
                }
            }

        } else if(construction.canBuildHere(tilePos.x, tilePos.y)) {
            var b = Building.b[construction.building];
            var hasRes = true;
            for(var res in b.buildCost) {
                if(this.inv[res].amount < b.buildCost[res]) {
                    hasRes = false;
                }
            }
            if(hasRes) {
                if(!b.hasOwnProperty("buildOnce") || construction.builds[b.id].built == 0) {
                    for(var res in b.buildCost) {
                        this.inv[res].amount -= b.buildCost[res];
                    }
                    t.b = b.id;
                    t.bT = b.buildTex;
                    Building.buildEffect(tilePos.x, tilePos.y, b);
                    sound.play("build");
                } else {
                    sound.play("no_build");
                    this.doBeep(tilePos.x, tilePos.y, 9, 0);
                }
            } else {
                sound.play("no_build");
                this.doBeep(tilePos.x, tilePos.y, 1, 0);
            }
        }
    };


    this.doBeep = function(x, y, type, info) {
        if(type == 4 || type == 5 || type == 6 || this.beepCountdowns[type] == 0.0) {
            this.beepCountdowns[type] = 0.8;
            this.beeps[this.beepCounter] = {
                x : (x * 32) + rand(12, 20),
                y : (y * 32) - 128,
                type : type,
                life : 2.0,
                info : info
            };
            this.beepCounter++;
        }
    };


    this.gatherRes = function(tilePos, res, num) {

        var r = this.inv[res];
        r.amount += num;
        if(!r.show) {
            r.show = true;
        }

        var beforeManualProd = r.manualProd;
        r.manualProd += num;
        var afterManualProd = r.manualProd;
        achievements.checkManualProd(res, beforeManualProd, afterManualProd);

        var beforeProd = r.totalProd;
        r.totalProd += num;
        var afterProd = r.totalProd;
        achievements.checkProd(res, beforeProd, afterProd);

        this.stats.manualClick++;
        achievements.checkClick(this.stats.manualClick);

        sound.play(res);

        this.particles[this.particleCounter] = {
            x : (tilePos.x * 32) + rand(4, 12),
            y : (tilePos.y * 32) - 120,
            tO : Res.res[res].tO,
            life : 1.0
        };
        this.particleCounter++;

    };


    this.draw = function() {
        for(var particleId in this.particles) {
            if(this.particles[particleId].life < 0) {
                delete this.particles[particleId];
            } else {
                var par = this.particles[particleId];
                var yO = par.y + (Interpolate.sinIn(par.life) * 120);
                if(par.life < 0.5) {
                    c.globalAlpha = limit(par.life * 2.0, 0.0, 1.0);
                    img.drawSprite("res", par.x, yO, 16, 16, par.tO, 0);
                    c.globalAlpha = 1.0;
                } else {
                    img.drawSprite("res", par.x, yO, 16, 16, par.tO, 0);
                }
                par.life -= timer.delta;
            }
        }
        for(var beepId in this.beeps) {
            if(this.beeps[beepId].life < 0) {
                delete this.beeps[beepId];
            } else {
                var beep = this.beeps[beepId];
                var yO = beep.y + (Interpolate.sinIn(beep.life * 0.5) * 120);
                if(beep.life < 1.0) {
                    c.globalAlpha = limit(beep.life, 0.0, 1.0);
                }
                var text = "";
                if(beep.type == 1) {
                    text = "Not  enough  resources";
                } else if(beep.type == 2) {
                    text = "Cannot  be  built  here";
                } else if(beep.type == 3) {
                    text = "Population  limit  reached";
                } else if(beep.type == 4) {
                    text = "+" + beep.info + "  Population";
                } else if(beep.type == 5) {
                    if(beep.info == 1) {
                        text = "+" + beep.info + "  laborer";
                    } else {
                        text = "+" + beep.info + "  laborers";
                    }
                } else if(beep.type == 6) {
                    if(beep.info == 1) {
                        text = "-" + beep.info + "  laborer";
                    } else {
                        text = "-" + beep.info + "  laborers";
                    }
                } else if(beep.type == 7) {
                    text = "No  free  laborers";
                } else if(beep.type == 8) {
                    text = "max.  laborers  reached";
                } else if(beep.type == 9) {
                    text = "can  only  be  built  once";
                }
                c.fillStyle = "#fff";
                c.strokeStyle = "rgba(0, 0, 0, 0.8)";
                c.font = "16px \"BebasNeue\"";
                c.textAlign = "center";
                c.lineWidth = 4;
                c.lineJoin = "bevel";
                c.strokeText(text, beep.x, yO);
                c.fillText(text, beep.x, yO);
                c.lineWidth = 1;
                c.lineJoin = "miter";

                if(beep.life < 1.0) {
                    c.globalAlpha = 1.0;
                }
                beep.life -= timer.delta;
            }
        }
    };

}