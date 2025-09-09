function CustomPreloading() {};


CustomPreloading.preload = function() {

    var groundCanvas = createCanvas(256, 2528);
    var groundC = getContext(groundCanvas);

    groundC.drawImage(img.get("baseGround"), 0, 0);

    for(var i = 0; i < 2401; i++) { // 7^4 = 2401

        var x = (i % 16) * 16;
        var y = (7 + Math.floor(i / 16)) * 16;

        var tl = i % 7;
        var tr = (Math.floor(i / 7)) % 7;
        var br = (Math.floor(i / 49)) % 7;
        var bl = (Math.floor(i / 343)) % 7;

        var base = 6;
        if(tl < base) {
            base = tl;
        }
        if(tr < base) {
            base = tr;
        }
        if(br < base) {
            base = br;
        }
        if(bl < base) {
            base = bl;
        }

        groundC.drawImage(img.get("baseGround"), (i % 16) * 16, base * 16, 16, 16, x, y, 16, 16);

        for(var j = base + 1; j <= 6; j++) {
            var coverTileX = 0;
            if(tl == j) {
                coverTileX += 1;
            }
            if(tr == j) {
                coverTileX += 2;
            }
            if(br == j) {
                coverTileX += 4;
            }
            if(bl == j) {
                coverTileX += 8;
            }
            if(coverTileX != 0) {
                groundC.drawImage(img.get("borderGround"), coverTileX * 16, j * 16, 16, 16, x, y, 16, 16);
            }
        }
    }

    img.add("ground", groundCanvas);
    ImageProcessing.pixelate("ground", "ground", 2);

    var miniBuildingCanvas = createCanvas(128, 1);
    var miniBuildingC = getContext(miniBuildingCanvas);
    miniBuildingC.drawImage(img.get("building"), 0, 16, 2048, 16, 0, 0, 128, 1);
    img.add("miniMapBuilding", miniBuildingCanvas);

    ImageProcessing.pixelate("water", "water", 2);
    ImageProcessing.pixelate("building", "building", 2);
    ImageProcessing.pixelate("boxCorner", "boxCorner", 2);
    ImageProcessing.pixelate("boxHori", "boxHori", 2);
    ImageProcessing.pixelate("boxVert", "boxVert", 2);
    ImageProcessing.pixelate("res", "res", 2);
    ImageProcessing.pixelate("buttons", "buttons", 2);
    ImageProcessing.pixelate("achievements", "achievements", 2);
    ImageProcessing.pixelate("stars", "stars", 2);
    ImageProcessing.pixelate("buildMenuButton", "buildMenuButton", 2);
    ImageProcessing.pixelate("buildMenuButtonBG", "buildMenuButtonBG", 2);
    ImageProcessing.pixelate("minimapShadow", "minimapShadow", 2);
    ImageProcessing.pixelate("constructionBG", "constructionBG", 2);

};