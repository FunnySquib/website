function Map() {


    this.SIZE = 256;


    this.m;
    this.viewRadius;

    this.ani = 0.0;
    this.updateMiniMapCountdown = 20.0;

    this.resourceSpawn = 0.0;


    this.init = function() {

        this.createMap();
        while(!this.checkIfSuitable()) {
            this.createMap();
        }

        this.generateMiniMap();
    };


    this.createMap = function() {
        this.m = createMatrix(this.SIZE, this.SIZE, {
            bi : 0,
            g : 0,
            gT : 0,
            w : 0,
            iN : 0,
            b : -1,
            bT : -1,
            v : -1,
            o : 0.0,
        });

        for(var x = 0; x < this.SIZE; x++) {
            for(var y = 0; y < this.SIZE; y++) {
                this.m[x][y].o = randFloat(0.0, 1.0);
            }
        }

        MapGenerator.generate(this.m);

        this.viewRadius = 46;
        this.updateVisible();
    };


    this.checkIfSuitable = function() {
        var waterC = 0;
        var foodC = 0;
        var woodC = 0;
        var stoneC = 0;
        var mountC = 0;
        var edge = limit(Math.round(this.SIZE / 2) - this.viewRadius, 0, this.SIZE);
        for(var x = edge; x < this.SIZE - edge; x++) {
            for(var y = edge; y < this.SIZE - edge; y++) {
                var t = this.m[x][y];
                if(t.v == 2) {
                    if(t.w > 0) {
                        waterC++;
                    }
                    if(t.bi == 6 && t.b <= 0) {
                        mountC++;
                    }
                    if(t.b == 1) {
                        woodC++;
                    } else if(t.b >= 2 && t.b <= 10) {
                        stoneC++;
                    } else if(t.b >= 11 && t.b <= 22) {
                        foodC++;
                    }
                }
            }
        }
        return waterC > 200 && foodC > 100 && woodC > 800 && stoneC > 40 && mountC > 60;
    };


    this.updateVisible = function() {
        var r = this.viewRadius;
        var mid = (this.SIZE / 2) + 0.5;
        var mid2 = (this.SIZE / 2);

        for(var x = 0; x < this.SIZE; x++) {
            for(var y = 0; y < this.SIZE; y++) {
                var t = this.m[x][y];
                if(t.v != 2) {
                    var dst = distance(mid, mid, x, y);
                    var dst2 = distance(mid2, mid2, x, y);
                    if(dst < r) {
                        t.v = 2;
                    } else if(dst < r + 1.4142) {
                        if(dst2 < r + 0.7071) {
                            t.v = 1;
                        } else {
                            t.v = 0;
                        }
                    }
                }
            }
        }
    };


    this.update = function() {

        this.ani += timer.delta;
        while(this.ani > 1.0) {
            this.ani -= 1.0;
        }

        this.updateMiniMapCountdown -= timer.delta;
        if(this.updateMiniMapCountdown < 0.0) {
            this.updateMiniMapCountdown = 20.0;
            this.generateMiniMap();
        }

        this.resourceSpawn += timer.delta;
        while(this.resourceSpawn > 1.0) {
            this.resourceSpawn -= 1.0;
            if(zeroOrOne(0.6)) {
                MapGenerator.growTree();
            }
            if(zeroOrOne(0.3)) {
                MapGenerator.growStone();
            }
            for(var i = 0; i < 4; i++) {
                MapGenerator.growFruit();
            }
        }
    };


    this.draw = function() {

        var corners = camera.getMapDrawCorners();
        var mouseOver = camera.getSelectedTile();

        var t;
        var gX;
        var gY;
        var x;
        var y;
        for(x = corners.startX; x <= corners.endX; x++) {
            for(y = corners.startY; y <= corners.endY; y++) {
                t = this.m[x][y];
                if(t.v > 0) {
                    gX = t.gT % 16;
                    gY = Math.floor(t.gT / 16);
                    img.drawSprite("ground", (x * 32) + 16, (y * 32) + 16, 32, 32, gX, gY);
                }
            }
        }
        var wAni;
        var wX;
        var wY;
        for(x = corners.startX; x <= corners.endX; x++) {
            for(y = corners.startY; y <= corners.endY; y++) {
                t = this.m[x][y];
                if(t.w > 0 && t.v != -1) {
                    wAni = Math.floor(5.0 * (this.ani + t.o)) % 5;
                    wX = (t.w % 16) + (16 * wAni);
                    wY = Math.floor(t.w / 16);
                    img.drawSprite("water", x * 32, y * 32, 32, 32, wX, wY);
                }
                if(t.v == 0 || t.v == 1) {
                    c.fillStyle = "rgba(0, 0, 0, 0.6)";
                    c.fillRect(x * 32, y * 32, 32, 32);
                }
            }
        }
        var bAni;
        for(x = corners.startX; x <= corners.endX; x++) {
            for(y = corners.startY; y <= corners.endY; y++) {
                t = this.m[x][y];
                if(x == mouseOver.x && y == mouseOver.y) {
                    if(t.b <= 0 && t.w == 0 && construction.building != -1) {
                        if(construction.canBuildHere(x, y)) {
                            img.drawSprite("tileSelection", (x * 32) - 2, (y * 32) - 2, 36, 36, 1, 0);
                        } else {
                            img.drawSprite("tileSelection", (x * 32) - 2, (y * 32) - 2, 36, 36, 2, 0);
                        }
                    } else {
                        img.drawSprite("tileSelection", (x * 32) - 2, (y * 32) - 2, 36, 36, 0, 0);
                    }
                }
                if(t.bT > -1 && t.v == 2) {
                    if(Building.animatedTexture[t.bT]) {
                        bAni = Math.floor(5.0 * (this.ani + t.o)) % 5;
                        img.drawSprite("building", x * 32, (y * 32) - 32, 32, 64, t.bT, bAni);
                    } else {
                        img.drawSprite("building", x * 32, (y * 32) - 32, 32, 64, t.bT, 0);
                    }
                }
            }
        }
    };


    this.drawDebug = function() {
        var t;
        for(var x = 0; x < this.SIZE; x++) {
            for(var y = 0; y < this.SIZE; y++) {
                t = this.m[x][y];
                if(t.g == 0) {
                    c.fillStyle = "#d7c59b";
                } else if(t.g == 1) {
                    c.fillStyle = "#869b49";
                } else if(t.g == 2) {
                    c.fillStyle = "#20981e";
                } else if(t.g == 3) {
                    c.fillStyle = "#288125";
                } else if(t.g == 4) {
                    c.fillStyle = "#3b652f";
                } else if(t.g == 5) {
                    c.fillStyle = "#767871";
                } else if(t.g == 6) {
                    c.fillStyle = "#e6e6e6";
                }
                c.fillRect(x * 4, y * 4, 4, 4);
                if(t.w > 0) {
                    c.fillStyle = "#00c";
                    c.fillRect((x * 4) + 1, (y * 4) + 1, 2, 2);
                }
            }
        }
    };


    this.generateMiniMap = function() {

        var mmCanvas = createCanvas(this.SIZE, this.SIZE);
        var mmC = getContext(mmCanvas);

        mmC.fillStyle = "#000";
        mmC.fillRect(0, 0, this.SIZE, this.SIZE);

        var t;
        for(var x = 0; x < this.SIZE; x++) {
            for(var y = 0; y < this.SIZE; y++) {
                t = this.m[x][y];
                if(t.v != -1) {
                    if(t.g == 0) {
                        mmC.fillStyle = "#d7c59b";
                    } else if(t.g == 1) {
                        mmC.fillStyle = "#869b49";
                    } else if(t.g == 2) {
                        mmC.fillStyle = "#20981e";
                    } else if(t.g == 3) {
                        mmC.fillStyle = "#288125";
                    } else if(t.g == 4) {
                        mmC.fillStyle = "#3b652f";
                    } else if(t.g == 5) {
                        mmC.fillStyle = "#767871";
                    } else if(t.g == 6) {
                        mmC.fillStyle = "#e6e6e6";
                    }
                    if(t.v == 1) {
                        mmC.globalAlpha = 0.4;
                        mmC.fillRect(x, y, 1, 1);
                        mmC.globalAlpha = 1.0;
                    } else {
                        mmC.fillRect(x, y, 1, 1);
                    }
                    if(t.w > 0) {
                        mmC.globalAlpha = 0.8;
                        mmC.fillStyle = "#00f";
                        mmC.fillRect(x, y, 1, 1);
                        mmC.globalAlpha = 1.0;
                    }

                    if(t.bT > 0 && t.v == 2) {
                        mmC.drawImage(img.get("miniMapBuilding"), t.bT, 0, 1, 1, x, y, 1, 1);
                    }
                }
            }
        }
        img.add("miniMapTemp", mmCanvas);

        var mmPCanvas = createCanvas(100, 100);
        var mmPC = getContext(mmPCanvas);
        mmPC.drawImage(img.get("miniMapTemp"), 0, 0, 256, 256, 0, 0, 100, 100);
        img.add("miniMapTemp", mmPCanvas);
        ImageProcessing.pixelate("miniMapTemp", "miniMap", 2);
    };

}


Map.biomeNames = [
    "Oasis",
    "Desert",
    "Savanna",
    "Jungle",
    "Forest",
    "Taiga",
    "Mountain",
    "Snow",
    "Water"
];