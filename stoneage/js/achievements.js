function Achievements() {


    this.state;

    this.displays = {};
    this.displayCounter = 0;

    this.panelH = -64;
    this.panelV = 0;

    this.particles;


    this.init = function() {

        this.state = {};
        for(var aId in Achievements.a) {
            this.state[aId] = {
                got : false,
            };
        }

        this.displays = {};
        this.displayCounter = 0;

        this.particles = new ParticleSystem();
        this.particles.setMode(ParticleSystem.BURST_MODE);
        this.particles.setType(1);
        this.particles.setEmitterSize(20.0, 20.0, 0.0);
        this.particles.setV(-150.0, 150.0, -150.0, 150.0, 0.0, 0.0);
        this.particles.setFriction(80.0, 80.0, 0.0);
        this.particles.setLife(0.3, 0.8);
        this.particles.setParticlesPerTick(32);
    };


    this.fireAchievement = function(aId) {
        if(this.state.hasOwnProperty(aId) && !this.state[aId].got) {
            this.state[aId].got = true;
            var a = Achievements.a[aId];
            if(Achievements.a[aId].hasOwnProperty("next")) {
                this.state[Achievements.aIds[Achievements.a[aId].next]].show = true;
            }
            player.increaseView();
            sound.play("achi");

            this.displays[this.displayCounter] = {
                life : 10.0,
                o : a.o,
                title : a.title,
                desc : a.desc,
                particles : false
            };
            this.displayCounter++;
        }
    };


    this.draw = function() {

        var numOfElements = 0;
        var requiredHeight = 0;
        var displayId;
        for(displayId in this.displays) {
            if(this.displays[displayId].life < 0) {
                delete this.displays[displayId];
            } else {
                this.displays[displayId].life -= timer.delta;
                numOfElements++;
                if(this.displays[displayId].life > 2.0) {
                    requiredHeight += 60;
                }
            }
        }
        if(requiredHeight == 0) {
            requiredHeight = -60;
        } else {
            requiredHeight += 8;
        }
        if(numOfElements > 0) {

            var interpol = Interpolate.accelerateToPos(this.panelH, requiredHeight, this.panelV, 300.0, 150.0);
            this.panelV = interpol.velocity;
            this.panelH = interpol.pos;

            c.save();
            c.translate(game.centerX, 0);

            panel.drawBox(-190, 0, 380, this.panelH, false, true, true, true, true);

            var aPos = this.panelH;
            if(aPos > requiredHeight) {
                aPos = requiredHeight;
            }
            aPos -= 4;
            for(displayId in this.displays) {
                var a = this.displays[displayId];
                if(a.life > 2.0) {
                    if(a.life < 3.0) {
                        c.globalAlpha = limit(a.life - 2.0, 0.0, 1.0);
                    }
                    if(a.life < 9.9 && this.panelV == 0.0 && !a.particles) {
                        this.particles.setEmitter(-160, aPos - 30, 0);
                        this.particles.burst();
                        a.particles = true;
                    }
                    panel.text(-130, aPos - 42, 20, "left", "ACHIEVEMENT: \"" + a.title + "\"");
                    panel.text(-130, aPos - 24, 16, "left", a.desc);
                    panel.text(-130, aPos - 6, 16, "left", "Reward: +2 Visibility radius");
                    img.drawSprite("achiBox", -180, aPos - 50, 40, 40, 2, 0);
                    img.drawSprite("achievements", -176, aPos - 46, 32, 32, a.o, 0);
                    c.globalAlpha = 1.0;

                    aPos -= 60;
                }
            }
            this.particles.draw();

            c.restore();
        }
    };


    this.drawScreen = function() {

        c.fillStyle = "rgba(0, 0, 0, 0.4)";
        c.fillRect(0, 0, game.width, game.height);

        c.save();
        c.translate(game.centerX - 350, game.centerY - 160);

        panel.drawBox(0, 0, 700, 320, true, true, true, true, true);
        panel.text(350, 44, 36, "center", "Achievements");

        var i = 0;
        for(var aId in this.state) {
            var a = this.state[aId];
            var aD = Achievements.a[aId];
            var y = 64 + (Math.floor(i / 14) * 48)
            var x = 18 + ((i % 14) * 48);
            if(a.got) {
                img.drawSprite("achiBox", x, y, 40, 40, 2, 0);
                img.drawSprite("achievements", x + 4, y + 4, 32, 32, aD.o, 0);
            } else {
                img.drawSprite("achiBox", x, y, 40, 40, 0, 0);
            }
            i++;
        }

        c.restore();

        panel.drawButton(game.centerX + 260, game.centerY + 106, "Close");
    };


    this.hover = function() {
        var i = 0;
        for(var aId in this.state) {
            var a = this.state[aId];
            var y = (game.centerY - 160) + 64 + (Math.floor(i / 14) * 48)
            var x = (game.centerX - 350) + 18 + ((i % 14) * 48);
            if(mouse.isOver(x, y, 40, 40)) {
                if(a.got) {
                    panel.hintType = "achi";
                    panel.hintText = aId;
                } else {
                    panel.hintType = "achi";
                    panel.hintText = "";
                }
            }
            i++;
        }
    };


    this.checkClick = function(manualClick) {
        var limits = [50, 250, 1000, 2500, 10000, 25000, 100000];
        for(var i = 0; i < limits.length; i++) {
            if(manualClick == limits[i]) {
                this.fireAchievement("manualProd" + limits[i]);
            }
        }
    };


    this.checkManualProd = function(res, before, after) {
        var limits = [100, 1000, 10000, 100000];
        for(var i = 0; i < limits.length; i++) {
            if(before < limits[i] && after >= limits[i]) {
                this.fireAchievement(res + "Manual" + limits[i]);
            }
        }
    };


    this.checkProd = function(res, before, after) {
        var limits = [500, 5000, 50000, 500000, 5000000];
        for(var i = 0; i < limits.length; i++) {
            if(before < limits[i] && after >= limits[i]) {
                this.fireAchievement(res + limits[i]);
            }
        }
    };


    this.checkPopulation = function(before, after) {
        var limits = [10, 25, 100, 250, 1000, 2500, 10000];
        for(var i = 0; i < limits.length; i++) {
            if(before < limits[i] && after >= limits[i]) {
                this.fireAchievement("pop" + limits[i]);
            }
        }
    };

}


Achievements.a = {

    manualProd50 :      { o : 0,    title : "That's a good start",              desc : "Click 50 times for resources.",         next : 1, start : true},
    manualProd250 :     { o : 1,    title : "Getting the hang of it",           desc : "Click 250 times for resources.",        next : 2 },
    manualProd1000 :    { o : 2,    title : "Might be time for a break",        desc : "Click 1,000 times for resources.",      next : 3 },
    manualProd2500 :    { o : 3,    title : "Sore finger",                      desc : "Click 2,500 times for resources.",      next : 4 },
    manualProd10000 :   { o : 4,    title : "Annoying clicking sounds",         desc : "Click 10,000 times for resources.",     next : 5 },
    manualProd25000 :   { o : 5,    title : "Professional clicker",             desc : "Click 25,000 times for resources.",     next : 6 },
    manualProd100000 :  { o : 6,    title : "Stop playing and go outside!",     desc : "Click 100,000 times for resources." },

    wateManual100 :     { o : 7,    title : "Thirst-quenching",                 desc : "Gather 100 water manually.",            next : 8, start : true },
    wateManual1000 :    { o : 8,    title : "Water slide park",                 desc : "Gather 1,000 water manually.",          next : 9 },
    wateManual10000 :   { o : 9,    title : "Human waterfall",                  desc : "Gather 10,000 water manually.",         next : 10 },
    wateManual100000 :  { o : 10,   title : "A thousand storm surges",          desc : "Gather 100,000 water manually." },

    wate500 :           { o : 11,   title : "Open faucet",                      desc : "Gather 500 water.",                     next : 12, start : true },
    wate5000 :          { o : 12,   title : "professional garden hose",         desc : "Gather 5,000 water.",                   next : 13 },
    wate50000 :         { o : 13,   title : "Incoming flood",                   desc : "Gather 50,000 water.",                  next : 14 },
    wate500000 :        { o : 14,   title : "Artificial rain storm",            desc : "Gather 500,000 water.",                 next : 15 },
    wate5000000 :       { o : 15,   title : "A million oceans",                 desc : "Gather 5,000,000 water." },

    foodManual100 :     { o : 16,   title : "Make me a sandwich",               desc : "Gather 100 food manually.",             next : 17, start : true },
    foodManual1000 :    { o : 17,   title : "Hunting for berries",              desc : "Gather 1,000 food manually.",           next : 18 },
    foodManual10000 :   { o : 18,   title : "Eating competition",               desc : "Gather 10,000 food manually.",          next : 19 },
    foodManual100000 :  { o : 19,   title : "Mr. Creosote",                     desc : "Gather 100,000 food manually." },

    food500 :           { o : 20,   title : "A healthy meal",                   desc : "Gather 500 food.",                      next : 21, start : true },
    food5000 :          { o : 21,   title : "jealous starving children",        desc : "Gather 5,000 food.",                    next : 22 },
    food50000 :         { o : 22,   title : "McBurgerTown family deal",         desc : "Gather 50,000 food.",                   next : 23 },
    food500000 :        { o : 23,   title : "U.n. world food program",          desc : "Gather 500,000 food.",                  next : 24 },
    food5000000 :       { o : 24,   title : "Food to the moon and beyond",      desc : "Gather 5,000,000 food." },

    woodManual100 :     { o : 25,   title : "Getting wood",                     desc : "Gather 100 wood manually.",             next : 26, start : true },
    woodManual1000 :    { o : 26,   title : "My diy project",                   desc : "Gather 1,000 wood manually.",           next : 27 },
    woodManual10000 :   { o : 27,   title : "Human lumber mill",                desc : "Gather 10,000 wood manually.",          next : 28 },
    woodManual100000 :  { o : 28,   title : "Can't see the forest",             desc : "Gather 100,000 wood manually." },

    wood500 :           { o : 29,   title : "Collecting driftwood",             desc : "Gather 500 wood.",                      next : 30, start : true },
    wood5000 :          { o : 30,   title : "Lumber yard founder",              desc : "Gather 5,000 wood.",                    next : 31 },
    wood50000 :         { o : 31,   title : "May the forest be with you",       desc : "Gather 50,000 wood.",                   next : 32 },
    wood500000 :        { o : 32,   title : "Threatening deforestation",        desc : "Gather 500,000 wood.",                  next : 33 },
    wood5000000 :       { o : 33,   title : "USS Dunderberg",                   desc : "Gather 5,000,000 wood." },

    stonManual100 :     { o : 34,   title : "A stone's throw",                  desc : "Gather 100 stone manually.",            next : 35, start : true },
    stonManual1000 :    { o : 35,   title : "Living in glass houses",           desc : "Gather 1,000 stone manually.",          next : 36 },
    stonManual10000 :   { o : 36,   title : "Over 9000 stones",                 desc : "Gather 10,000 stone manually.",         next : 37 },
    stonManual100000 :  { o : 37,   title : "A story cast in stone",            desc : "Gather 100,000 stone manually." },

    ston500 :           { o : 38,   title : "Rock'n'roll",                      desc : "Gather 500 stone.",                     next : 39, start : true },
    ston5000 :          { o : 39,   title : "Sticks and stones",                desc : "Gather 5,000 stone.",                   next : 40 },
    ston50000 :         { o : 40,   title : "Getting stoned",                   desc : "Gather 50,000 stone.",                  next : 41 },
    ston500000 :        { o : 41,   title : "A heavy burden",                   desc : "Gather 500,000 stone.",                 next : 42 },
    ston5000000 :       { o : 42,   title : "I'm already rock hard, baby!",     desc : "Gather 5,000,000 stone." },

    pop10 :             { o : 43,   title : "Populating the world",             desc : "Reach population of 10." },
    pop25 :             { o : 44,   title : "Founding a village",               desc : "Reach population of 25." },
    pop100 :            { o : 45,   title : "Dunbar's number",                  desc : "Reach population of 100." },
    pop250 :            { o : 46,   title : "Nearly a spartan movie",           desc : "Reach population of 250." },
    pop1000 :           { o : 47,   title : "Hamlet",                           desc : "Reach population of 1000." },
    pop2500 :           { o : 48,   title : "Town folk",                        desc : "Reach population of 2500." },
    pop10000 :          { o : 49,   title : "City builder",                     desc : "Reach population of 10000." },

    outbreak :          { o : 50,   title : "The calm after the storm",         desc : "Survive a Disease outbreak." },
    iron :              { o : 51,   title : "Time to mine!",                    desc : "Produce iron ore." },
    gold :              { o : 52,   title : "Golden age",                       desc : "Produce gold." },

    shrine :            { o : 53,   title : "Pray to the gods",                 desc : "Build a shrine" },
    temple :            { o : 54,   title : "ascending olympia",                desc : "Build a temple." },
    victory :           { o : 55,   title : "Victory",                          desc : "Build the golden statue." },


};


Achievements.aIds = [];
for(var aId in Achievements.a) {
    Achievements.aIds[Achievements.a[aId].o] = aId;
}