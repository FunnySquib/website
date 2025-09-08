function Camera() {

    this.A = 2400.0;
    this.MAX_V = 600.0;

    this.precisionX = 0;
    this.precisionY = 0;

    this.x = 0;
    this.y = 0;

    this.v = { x : 0, y : 0 };

    this.mapDrawCorners = {
        startX : 0,
        endX : 0,
        startY : 0,
        endY : 0
    };


    this.init = function() {
        this.precisionX = (map.SIZE * 32) / 2.0;
        this.precisionY = (map.SIZE * 32) / 2.0;
        this.x = Math.round(this.precisionX);
        this.y = Math.round(this.precisionY);
    };


    this.update = function() {
        var arrowControls = getArrowControls();
        if(arrowControls.x == 0.0) {
            if(this.v.x > 0) {
                this.v.x -= this.A * timer.delta;
                if(this.v.x < 0) {
                    this.v.x = 0;
                }
            } else if(this.v.x < 0) {
                this.v.x += this.A * timer.delta;
                if(this.v.x > 0) {
                    this.v.x = 0;
                }
            }
        } else {
            this.v.x += this.A * arrowControls.x * timer.delta;
            if(arrowControls.x > 0 && this.v.x > this.MAX_V * arrowControls.x) {
                this.v.x = this.MAX_V * arrowControls.x;
            }
            if(arrowControls.x < 0 && this.v.x < this.MAX_V * arrowControls.x) {
                this.v.x = this.MAX_V * arrowControls.x;
            }
        }

        if(arrowControls.y == 0.0) {
            if(this.v.y > 0) {
                this.v.y -= this.A * timer.delta;
                if(this.v.y < 0) {
                    this.v.y = 0;
                }
            } else if(this.v.y < 0) {
                this.v.y += this.A * timer.delta;
                if(this.v.y > 0) {
                    this.v.y = 0;
                }
            }
        } else {
            this.v.y += this.A * arrowControls.y * timer.delta;
            if(arrowControls.y > 0 && this.v.y > this.MAX_V * arrowControls.y) {
                this.v.y = this.MAX_V * arrowControls.y;
            }
            if(arrowControls.y < 0 && this.v.y < this.MAX_V * arrowControls.y) {
                this.v.y = this.MAX_V * arrowControls.y;
            }
        }
        this.precisionX += this.v.x * timer.delta;
        this.precisionY += this.v.y * timer.delta;
        this.precisionX = limit(this.precisionX, 0, map.SIZE * 32);
        this.precisionY = limit(this.precisionY, 0, map.SIZE * 32);
        this.x = Math.round(this.precisionX);
        this.y = Math.round(this.precisionY);
        player.stats.cameraX = this.x;
        player.stats.cameraY = this.y;

        var startX = Math.floor((this.x - game.centerX) / 32.0) - 1;
        var endX = Math.ceil((this.x + game.centerX) / 32.0);
        var startY = Math.floor((this.y - game.centerY) / 32.0) - 1;
        var endY = Math.ceil((this.y + game.centerY) / 32.0);

        this.mapDrawCorners = {
            startX : limit(startX, 0, map.SIZE - 1),
            endX : limit(endX, 0, map.SIZE - 1),
            startY : limit(startY, 0, map.SIZE - 1),
            endY : limit(endY, 0, map.SIZE - 1)
        };

        if(player.stats.tutorial == 1 && (arrowControls.x != 0.0 || arrowControls.y != 0.0)) {
            player.stats.tutorial = 2;
        }
    };


    this.apply = function() {
        c.save();
        c.translate(game.centerX - this.x, game.centerY - this.y);
    };


    this.restore = function() {
        c.restore();
    };


    this.getMapDrawCorners = function() {
        return this.mapDrawCorners;
    };


    this.getMiniMapCorners = function() {
        var scale = 200.0 / 256.0;
        return {
            startX : limit(Math.round(this.mapDrawCorners.startX * scale), 1, 199),
            endX : limit(Math.round(this.mapDrawCorners.endX * scale), 1, 199),
            startY : limit(Math.round(this.mapDrawCorners.startY * scale), 1, 199),
            endY : limit(Math.round(this.mapDrawCorners.endY * scale), 1, 199)
        };
    };


    this.jumpToTile = function(x, y) {
        this.precisionX = (x * 32) + 16;
        this.precisionY = (y * 32) + 16;
        this.x = Math.round(this.precisionX);
        this.y = Math.round(this.precisionY);
        player.stats.cameraX = this.x;
        player.stats.cameraY = this.y;
    };


    this.getSelectedTile = function() {
        if(!panel.showMapHighlight || game.paused) {
            return { x : -1, y : -1 };
        }
        var x = Math.floor(((mouse.x - game.centerX) + this.x) / 32);
        var y = Math.floor(((mouse.y - game.centerY) + this.y) / 32);
        if(x <= 0 || x >= map.SIZE) {
            x = -1;
        }
        if(y <= 0 || y >= map.SIZE) {
            y = -1;
        }
        if(x != -1 && y != -1 && map.m[x][y].v != 2) {
            return { x : -1, y : -1 };
        }
        return {
            x : x,
            y : y,
        };
    };
}