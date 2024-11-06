function Building() {}


Building.getHintContent = function(tilePos) {

    var lines = 0;
    var tileOffset = -1;
    var title = "";
    var line = [];

    var t = map.m[tilePos.x][tilePos.y];

    if(t.w > 0) {
        lines = 1;
        title = "Water tile";
        line.push("Click to gather water.");

    } else if(t.b <= 0) {
        lines = 0;
        title = "Empty " + Map.biomeNames[t.bi] + " tile";
        if(construction.canBuildHere(tilePos.x, tilePos.y)) {
            var b = Building.b[construction.building];
            lines = 2;
            line.push("Click to build " + b.name);
            line.push(this.getCostText(b.buildCost));
        }

    } else {
        var b = Building.b[t.b];
        title = b.name;
        if(t.b == 1) {
            title = Map.biomeNames[t.bi] + " Tree";
        }
        if(b.hasOwnProperty("clickRes")) {
            for(var i = 0; i < b.clickRes.length; i++) {
                lines++;
                line.push("Click to gather " + Res.res[b.clickRes[i].res].name + ".");
            }
        }
        if(b.hasOwnProperty("regrowTo")) {
            lines++;
            line.push("The fruit will be ripe soon.");
        }
        if(b.hasOwnProperty("houses")) {
            lines++;
            line.push("Click to create a person. (-5 food)");
        }
        if(b.hasOwnProperty("workers")) {
            var build = construction.builds[b.id];
            title += "  ($" + build.workers + "$/$" + build.maxWorkers + " laborers$)";
            lines++;
            line.push("Click to assign an idle laborer.");
            lines++;
            line.push("Shift + Click to withdraw a laborer.");
        }
        if(b.hasOwnProperty("buildCost") && b.id != 52) {
            lines++;
            line.push("Hold X + Click to destroy building.");
        }
    }

    return {
        lines : lines,
        tileOffset : tileOffset,
        title : title,
        line1 : line[0],
        line2 : line[1],
        line3 : line[2]
    };
};


Building.buildEffect = function(x, y, b) {
    construction.builds[b.id].built++;
    if(b.id == 23 && !player.stats.showPopulation) {
        player.stats.showPopulation = true;
        player.stats.tutorial++;
    }
    if(b.hasOwnProperty("unlocks")) {
        for(var i = 0; i < b.unlocks.length; i++) {
            construction.unlock(b.unlocks[i]);
        }
    }
    if(b.hasOwnProperty("houses")) {
        player.stats.showPopulation = true;
        player.stats.maxPopulation += b.houses;
    }
    if(b.hasOwnProperty("workers")) {
        construction.builds[b.id].maxWorkers += b.workers;
    }
    if(b.hasOwnProperty("special")) {
        if(b.special == "food1%") {
            player.inv.food.multiplier += 0.01;
        } else if(b.special == "wate1%") {
            player.inv.wate.multiplier += 0.01;
        } else if(b.special == "all1%") {
            player.stats.prodMultiplier += 0.01;
        } else if(b.special == "click5") {
            achievements.fireAchievement("shrine");
            player.stats.clickMultiplier *= 5.0;
        } else if(b.special == "click10") {
            achievements.fireAchievement("temple");
            player.stats.clickMultiplier *= 10.0;
        } else if(b.special == "victory") {
            achievements.fireAchievement("victory");
        }
    }
};


Building.destroyEffect = function(x, y, b) {
    construction.builds[b.id].built--;
    for(var res in b.buildCost) {
        player.inv[res].amount += Math.floor(b.buildCost[res] / 2.0);
    }
    if(b.hasOwnProperty("houses")) {
        player.stats.maxPopulation -= b.houses;
    }
    if(b.hasOwnProperty("workers")) {
        var build = construction.builds[b.id];
        build.maxWorkers -= b.workers;
        if(build.workers > build.maxWorkers) {
            var num = build.workers - build.maxWorkers;
            build.workers -= num;
            player.stats.idleLaborers += num;
        }
    }
    if(b.hasOwnProperty("special")) {
        if(b.special == "food1%") {
            player.inv.food.multiplier -= 0.01;
        } else if(b.special == "wate1%") {
            player.inv.wate.multiplier -= 0.01;
        } else if(b.special == "all1%") {
            player.stats.prodMultiplier -= 0.01;
        } else if(b.special == "click5") {
            player.stats.clickMultiplier /= 5.0;
        } else if(b.special == "click10") {
            player.stats.clickMultiplier /= 10.0;
        }
    }
};


Building.addWorker = function(id, numOfWorkers) {
    var build = construction.builds[id];
    if(build.maxWorkers <= build.workers) {
        return -1;
    } else if(build.maxWorkers < build.workers + numOfWorkers) {
        var num = build.maxWorkers - build.workers;
        build.workers += num;
        return num;
    } else {
        build.workers += numOfWorkers;
        return numOfWorkers;
    }
};


Building.removeWorker = function(id, numOfWorkers) {
    var build = construction.builds[id];
    if(build.workers - numOfWorkers < 0) {
        var num = build.workers;
        build.workers -= num;
        return num;
    } else {
        build.workers -= numOfWorkers;
        return numOfWorkers;
    }
};


Building.getSpecialText = function(special) {
    if(special == "food1%") {
        return "+1$% Food production";
    } else if(special == "wate1%") {
        return "+1$% water production";
    } else if(special == "all1%") {
        return "+1$% production of all resources";
    } else if(special == "click5") {
        return "clicks multiplied by 5  ($can only be built once$)";
    } else if(special == "click10") {
        return "clicks multiplied by 10  ($can only be built once$)";
    } else if(special == "victory") {
        return "Victory!";
    }
    return "";
};


Building.getCostText = function(buildCost) {
    var cost = "Cost: ";
    var costCounter = 0;
    for(var res in buildCost) {
        if(costCounter > 0) {
            cost += ", ";
        }
        cost += " " + panel.toNum(buildCost[res], 0) + " " + Res.res[res].name;
        costCounter++;
    }
    return cost;
};


Building.animatedTexture = [];
for(var i = 0; i < 100; i++) {
    Building.animatedTexture[i] = false;
}

Building.animatedTexture[9] = true;
Building.animatedTexture[10] = true;
Building.animatedTexture[11] = true;
Building.animatedTexture[15] = true;
Building.animatedTexture[16] = true;
Building.animatedTexture[17] = true;
Building.animatedTexture[21] = true;
Building.animatedTexture[22] = true;
Building.animatedTexture[23] = true;
Building.animatedTexture[27] = true;
Building.animatedTexture[28] = true;
Building.animatedTexture[29] = true;

Building.animatedTexture[45] = true;
Building.animatedTexture[46] = true;
Building.animatedTexture[47] = true;
Building.animatedTexture[48] = true;
Building.animatedTexture[49] = true;
Building.animatedTexture[50] = true;
Building.animatedTexture[51] = true;
Building.animatedTexture[52] = true;
Building.animatedTexture[53] = true;
Building.animatedTexture[54] = true;
Building.animatedTexture[55] = true;
Building.animatedTexture[56] = true;
Building.animatedTexture[63] = true;
Building.animatedTexture[76] = true;
Building.animatedTexture[79] = true;
Building.animatedTexture[81] = true;
Building.animatedTexture[84] = true;
Building.animatedTexture[85] = true;
Building.animatedTexture[86] = true;


Building.b = [
    { id : 0, name : "Empty" },

    { id : 1, name : "Tree", clickRes : [{ res : "wood", num : 2}], removeOnRes : true },

    { id : 2, name : "One Stone", clickRes : [{ res : "ston", num : 1}], removeOnRes : true },
    { id : 3, name : "Two Stones", clickRes : [{ res : "ston", num : 1}], changeOnRes : [2, 36] },
    { id : 4, name : "Three Stones", clickRes : [{ res : "ston", num : 1}], changeOnRes : [3, 37] },
    { id : 5, name : "One Stone", clickRes : [{ res : "ston", num : 1}], removeOnRes : true },
    { id : 6, name : "Two Stones", clickRes : [{ res : "ston", num : 1}], changeOnRes : [5, 39] },
    { id : 7, name : "Three Stones", clickRes : [{ res : "ston", num : 1}], changeOnRes : [6, 40] },
    { id : 8, name : "One Stone", clickRes : [{ res : "ston", num : 1}], removeOnRes : true },
    { id : 9, name : "Two Stones", clickRes : [{ res : "ston", num : 1}], changeOnRes : [8, 42] },
    { id : 10, name : "Three Stones", clickRes : [{ res : "ston", num : 1}], changeOnRes : [9, 43] },

    { id : 11, name : "Date Palm", regrowTo : [12, 46] },
    { id : 12, name : "Date Palm", clickRes : [{ res : "food", num : 24}], changeOnRes : [11, 45] },
    { id : 13, name : "Date Palm", regrowTo : [14, 48] },
    { id : 14, name : "Date Palm", clickRes : [{ res : "food", num : 24}], changeOnRes : [13, 47] },
    { id : 15, name : "Banana Tree", regrowTo : [16, 50] },
    { id : 16, name : "Banana Tree", clickRes : [{ res : "food", num : 4}], changeOnRes : [15, 49] },
    { id : 17, name : "Mango Tree", regrowTo : [18, 52] },
    { id : 18, name : "Mango Tree", clickRes : [{ res : "food", num : 4}], changeOnRes : [17, 51] },
    { id : 19, name : "Apple Tree", regrowTo : [20, 54] },
    { id : 20, name : "Apple Tree", clickRes : [{ res : "food", num : 4}], changeOnRes : [19, 53] },
    { id : 21, name : "Cherry Tree", regrowTo : [22, 56] },
    { id : 22, name : "Cherry Tree", clickRes : [{ res : "food", num : 4}], changeOnRes : [21, 55] },

    { id : 23, name : "Mud Hut",            buildTex : 57, buildCost : { wood : 5 }, buildPlace : 1, houses : 2, unlocks : [24, 29, 32], start : true },
    { id : 24, name : "Tent of branches",   buildTex : 58, buildCost : { wood : 40 }, buildPlace : 1, houses : 5, unlocks : [25] },
    { id : 25, name : "Dry brick hut",      buildTex : 59, buildCost : { wood : 200, clay : 200 }, buildPlace : 1, houses : 12, unlocks : [26] },
    { id : 26, name : "Wooden Hut",         buildTex : 60, buildCost : { wood : 800, ston : 400 }, buildPlace : 1, houses : 25, unlocks : [27] },
    { id : 27, name : "Brick House",        buildTex : 61, buildCost : { wood : 5000, clbr : 1200 }, buildPlace : 1, houses : 50, unlocks : [28] },
    { id : 28, name : "Stone House",        buildTex : 62, buildCost : { wood : 10000, stbr : 2500 }, buildPlace : 1, houses : 100, unlocks : [29] },

    { id : 29, name : "Water hole",         buildTex : 63, buildCost : { wood : 10 }, buildPlace : 2, workers : 2, prod : { wate : 1 }, unlocks : [30], },
    { id : 30, name : "Well",               buildTex : 64, buildCost : { ston : 100 }, buildPlace : 2, workers : 5, prod : { wate : 2 }, unlocks : [31] },
    { id : 31, name : "Water Pump",         buildTex : 65, buildCost : { wood : 1000, clbr : 20 }, buildPlace : 4, workers : 12, prod : { wate : 3 } },

    { id : 32, name : "Gatherer's hut",     buildTex : 66, buildCost : { wood : 10 }, buildPlace : 2, workers : 2, prod : { food : 1 }, unlocks : [33, 35, 52] },
    { id : 33, name : "Fruit garden",       buildTex : 67, buildCost : { wood : 100 }, buildPlace : 2, workers : 5, prod : { food : 2 }, unlocks : [34] },
    { id : 34, name : "Wheat field",        buildTex : 68, buildCost : { wood : 1000, stbr : 20 }, buildPlace : 2, workers : 12, prod : { food : 3 } },

    { id : 35, name : "Lumberjack lodge",   buildTex : 69, buildCost : { wood : 20 }, buildPlace : 2, workers : 4, prod : { wood : 1 }, unlocks : [36, 37, 39] },
    { id : 36, name : "Tree Plantation",    buildTex : 70, buildCost : { wood : 400, flin : 100 }, buildPlace : 2, workers : 12, prod : { wood : 2 } },

    { id : 37, name : "Stone Pit",          buildTex : 71, buildCost : { wood : 50}, buildPlace : 3, workers : 4, prod : { ston : 1 }, unlocks : [38, 41] },
    { id : 38, name : "Quarry",             buildTex : 72, buildCost : { wood : 1000, flin : 200 }, buildPlace : 3, workers : 12, prod : { ston : 2 } },

    { id : 39, name : "Clay Pit",           buildTex : 73, buildCost : { wood : 100, ston : 10 }, buildPlace : 4, workers : 5, prod : { clay : 1 }, unlocks : [40, 42] },
    { id : 40, name : "Knapping hut",       buildTex : 74, buildCost : { wood : 400, ston : 50 }, buildPlace : 3, workers : 5, prod : { flin : 1 } },

    { id : 41, name : "Stone Mason",        buildTex : 75, buildCost : { wood : 1000, ston : 200 }, buildPlace : 1, workers : 10, convFrom : { ston : 10 }, convTo : { stbr : 1 }, unlocks : [50, 43, 44] },
    { id : 42, name : "Brick oven",         buildTex : 76, buildCost : { clay : 1000 }, buildPlace : 1, workers : 10, convFrom : { clay : 10 }, convTo : { clbr : 1 }, unlocks : [33] },

    { id : 43, name : "Coal mine",          buildTex : 77, buildCost : { wood : 1000, flin : 1000 }, buildPlace : 3, workers : 20, prod : { coal : 1 } },
    { id : 44, name : "Iron mine",          buildTex : 78, buildCost : { ston : 500, flin : 1000 }, buildPlace : 3, workers : 20, prod : { iror : 1 }, unlocks : [45] },
    { id : 45, name : "Smelter",            buildTex : 79, buildCost : { stbr : 1000, clay : 1000 }, buildPlace : 1, workers : 25, convFrom : { iror : 10, coal : 20 }, convTo : { iron : 1 }, unlocks : [46, 47] },

    { id : 46, name : "Farm house",         buildTex : 80, buildCost : { wood : 10000, clbr : 1000 }, buildPlace : 2, special : "food1%", unlocks : [48] },
    { id : 47, name : "Cistern",            buildTex : 81, buildCost : { stbr : 1000 }, buildPlace : 1, special : "wate1%" },
    { id : 48, name : "Town center",        buildTex : 82, buildCost : { stbr : 1000, iron : 1000 }, buildPlace : 1, special : "all1%", unlocks : [49] },

    { id : 49, name : "Gold mine",          buildTex : 83, buildCost : { wood : 10000, ston : 10000 }, buildPlace : 3, workers : 5, prod : { gold : 1 }, unlocks : [51] },
    { id : 50, name : "Shrine",             buildTex : 84, buildCost : { wood : 10000, stbr : 10000 }, buildPlace : 2, special : "click5", buildOnce : true },
    { id : 51, name : "Temple",             buildTex : 85, buildCost : { stbr : 100000, gold : 10000 }, buildPlace : 2, special : "click10", buildOnce : true },
    { id : 52, name : "Golden statue",      buildTex : 86, buildCost : { gold : 100000 }, buildPlace : 1, special : "victory", buildOnce : true },

];
