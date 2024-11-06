function MapGenerator() {}


MapGenerator.generate = function(m) {

    var noise = ProceduralGeneration.perlinNoise(map.SIZE, 8, 0.4);
    ProceduralGeneration.scaleMatrixZeroToOne(noise);

    var x;
    var y;
    for(x = 0; x < map.SIZE; x++) {
        for(y = 0; y < map.SIZE; y++) {
            var n = noise[x][y];

            if(n < 0.06) {
                m[x][y].bi = 0;
                m[x][y].g = 2;
                m[x][y].iG = true;

            } else if(n < 0.2) {
                m[x][y].bi = 1;
                m[x][y].g = 0;

            } else if(n < 0.35) {
                m[x][y].bi = 2;
                m[x][y].g = 1;
                m[x][y].iG = true;

            } else if(n < 0.5) {
                m[x][y].bi = 3;
                m[x][y].g = 2;
                m[x][y].iG = true;

            } else if(n < 0.65) {
                m[x][y].bi = 4;
                m[x][y].g = 3;
                m[x][y].iG = true;

            } else if(n < 0.8) {
                m[x][y].bi = 5;
                m[x][y].g = 4;
                m[x][y].iG = true;

            } else if(n < 0.9) {
                m[x][y].bi = 6;
                m[x][y].g = 5;
                m[x][y].iR = true;

            } else {
                m[x][y].bi = 7;
                m[x][y].g = 6;
            }
            if(n < 0.01) {
                ProceduralGeneration.createIsland(m, map.SIZE, map.SIZE, x, y, 1, 1, function(map, x, y) {
                    if(x > 0 && y > 0) {
                        map[x][y].w = 1;
                    }
                });
            }
        }
    }

    for(var i = 0; i < 25; i++) {
        var randX = rand(0, map.SIZE - 1);
        var randY = rand(0, map.SIZE - 1);
        var randSize = rand(3, 9);
        ProceduralGeneration.createIsland(m, map.SIZE, map.SIZE, randX, randY, randSize, 2, function(map, x, y) {
            if(x > 0 && y > 0) {
                map[x][y].w = 1;
            }
        });
        if(randSize > 6) {
            ProceduralGeneration.createIsland(m, map.SIZE, map.SIZE, randX + rand(-5, 5), randY + rand(-5, 5), rand(1, 2), 1, function(map, x, y) {
                map[x][y].w = 0;
            });
        }
        for(var j = rand(1, 3); j > 0; j--) {
            MapGenerator.drawRiver(m, randX + rand(-3, 3), randY + rand(-3, 3), rand(0, 3), 0.015);
        }
    }

    for(x = 0; x < map.SIZE; x++) {
        for(y = 0; y < map.SIZE; y++) {
            var tl = m[x][y].g;
            var tr = tl;
            var br = tl;
            var bl = tl;
            if(x < map.SIZE - 1) {
                tr = m[x + 1][y].g;
            }
            if(y < map.SIZE - 1) {
                bl = m[x][y + 1].g;
            }
            if(x < map.SIZE - 1 && y < map.SIZE - 1) {
                br = m[x + 1][y + 1].g;
            }
            var value = (((((bl * 7) + br) * 7) + tr) * 7) + tl;

            if(value == 0) {
                m[x][y].gT = rand(0, 15);

            } else if(value == 400) {
                m[x][y].gT = 16 + rand(0, 15);

            } else if(value == 800) {
                m[x][y].gT = 32 + rand(0, 15);

            } else if(value == 1200) {
                m[x][y].gT = 48 + rand(0, 15);

            } else if(value == 1600) {
                m[x][y].gT = 64 + rand(0, 15);

            } else if(value == 2000) {
                m[x][y].gT = 80 + rand(0, 15);

            } else if(value == 2400) {
                m[x][y].gT = 96 + rand(0, 15);

            } else {
                m[x][y].gT = 112 + value;
            }

            if(m[x][y].w != 0) {
                var wT = 0;
                if(x > 0 && y > 0 && m[x - 1][y - 1].w != 0) {
                    wT += 1;
                }
                if(y > 0 && m[x][y - 1].w != 0) {
                    wT += 2;
                }
                if(x + 1 < map.SIZE && y > 0 && m[x + 1][y - 1].w != 0) {
                    wT += 4;
                }
                if(x + 1 < map.SIZE && m[x + 1][y].w != 0) {
                    wT += 8;
                }
                if(x + 1 < map.SIZE && y + 1 < map.SIZE && m[x + 1][y + 1].w != 0) {
                    wT += 16;
                }
                if(y + 1 < map.SIZE && m[x][y + 1].w != 0) {
                    wT += 32;
                }
                if(x > 0 && y + 1 < map.SIZE && m[x - 1][y + 1].w != 0) {
                    wT += 64;
                }
                if(x > 0 && m[x - 1][y].w != 0) {
                    wT += 128;
                }
                m[x][y].w = wT;
            }
        }
    }

    var t;
    for(x = 1; x < map.SIZE; x++) {
        for(y = 1; y < map.SIZE; y++) {
            t = m[x][y];

            if(t.w == 0) {

                if(t.g == 0) {
                    if(zeroOrOne(0.12)) {
                        t.b = 0;
                        t.bT = rand(0, 5);
                    }

                } else if(t.g == 1) {
                    if(zeroOrOne(0.32)) {
                        t.b = 0;
                        t.bT = rand(6, 8);
                    } else if(zeroOrOne(0.25)) {
                        t.b = 1;
                        t.bT = rand(9, 11);
                    }

                } else if(t.g == 2) {
                    if(zeroOrOne(0.25)) {
                        t.b = 0;
                        t.bT = rand(12, 14);
                    } else if(zeroOrOne(0.32)) {
                        t.b = 1;
                        t.bT = rand(15, 17);
                    }

                } else if(t.g == 3) {
                    if(zeroOrOne(0.3)) {
                        t.b = 0;
                        t.bT = rand(18, 20);
                    } else if(zeroOrOne(0.40)) {
                        t.b = 1;
                        t.bT = rand(21, 23);
                    }

                } else if(t.g == 4) {
                    if(zeroOrOne(0.3)) {
                        t.b = 0;
                        t.bT = rand(24, 26);
                    } else if(zeroOrOne(0.45)) {
                        t.b = 1;
                        t.bT = rand(27, 29);
                    }

                } else if(t.g == 5) {
                    if(zeroOrOne(0.4)) {
                        t.b = 0;
                        t.bT = rand(30, 32);
                    } else if(zeroOrOne(0.4)) {
                        var stoneType = rand(0, 8);
                        t.b = 2 + stoneType;
                        t.bT = 36 + stoneType;
                    }

                } else if(t.g == 6) {
                    if(zeroOrOne(0.15)) {
                        t.b = 0;
                        t.bT = rand(33, 35);
                    }
                }
            }
        }
    }

    for(x = 0; x < map.SIZE; x++) {
        for(y = 0; y < map.SIZE; y++) {
            t = m[x][y];
            if(t.w > 0) {
                t.bi = 8;
                t.b = -1;
            } else if(x > 0 && y > 0 && t.b == -1) {
                if(t.bi == 0) {
                    if(zeroOrOne(0.75)) {
                        var palmType = rand(0, 1) * 2;
                        t.b = 12 + palmType;
                        t.bT = 46 + palmType;
                    }
                } else if(t.bi == 3) {
                    if(zeroOrOne(0.15)) {
                        var treeType = rand(0, 1) * 2;
                        t.b = 16 + treeType;
                        t.bT = 50 + treeType;
                    }
                } else if(t.bi == 4) {
                    if(zeroOrOne(0.15)) {
                        var treeType = rand(0, 1) * 2;
                        t.b = 20 + treeType;
                        t.bT = 54 + treeType;
                    }
                }
                if(t.bi != 0 && t.bi != 3) {
                    if(zeroOrOne(0.02)) {
                        var stoneType = rand(0, 8);
                        t.b = 2 + stoneType;
                        t.bT = 36 + stoneType;
                    }
                }
            }
            if(x > 0 && m[x - 1][y].w > 0 ||
                y > 0 && m[x][y - 1].w > 0 ||
                x < map.SIZE - 1 && m[x + 1][y].w > 0 ||
                y < map.SIZE - 1 && m[x][y + 1].w > 0) {
                t.iN = 1;
            }
        }
    }

};


MapGenerator.drawRiver = function(m, x, y, dir, chanceOfSource) {
    var inLake = true;
    var proceed = true;
    var countdown = 64;
    var dirMove = dir;

    while(proceed && countdown > 0) {
        countdown--;
        if(zeroOrOne(0.8)) {
            if(dirMove == dir) {
                dirMove = (dir + rand(-1, 1)) % 4;
            } else {
                dirMove = dir;
            }
        }
        if(dirMove == 0) {
            x++;
        } else if(dirMove == 1) {
            y++;
        } else if(dirMove == 2) {
            x--;
        } else if(dirMove == 3) {
            y--;
        }
        if(x < 1 || x >= map.SIZE - 1 || y < 1 || y >= map.SIZE - 1) {
            proceed = false;
        } else {
            if(inLake && m[x][y].w == 0) {
                inLake = false;
            }
            if(!inLake) {
                if(m[x][y].w != 0) {
                    proceed = false;
                } else {
                    if(zeroOrOne(chanceOfSource)) {
                        proceed = false;
                    } else {
                        m[x][y].w = 1;
                        if(zeroOrOne(0.05)) {
                            MapGenerator.drawRiver(m, x, y, (dir + rand(-1, 1)) % 4, chanceOfSource * 3);
                        }
                    }
                }
            }
        }
    }
};


MapGenerator.growTree = function() {
    var randSpot = { x : rand(1, map.SIZE - 1), y : rand(1, map.SIZE - 1) };
    var t = map.m[randSpot.x][randSpot.y];
    if(t.b == -1) {
        if(t.bi == 2) {
            t.b = 1;
            t.bT = rand(9, 11);
        } else if(t.bi == 0 || t.bi == 3) {
            t.b = 1;
            t.bT = rand(15, 17);
        } else if(t.bi == 4) {
            t.b = 1;
            t.bT = rand(21, 23);
        } else if(t.bi == 5) {
            t.b = 1;
            t.bT = rand(27, 29);
        }
    }
};


MapGenerator.growStone = function() {
    var randSpot = { x : rand(1, map.SIZE - 1), y : rand(1, map.SIZE - 1) };
    var t = map.m[randSpot.x][randSpot.y];
    if(t.b == -1) {
        if(t.bi != 0 && t.bi != 3 && t.bi != 8) {
            var corners = camera.getMapDrawCorners();
            if(randSpot.x < corners.startX || randSpot.x > corners.endX ||
                randSpot.y < corners.startY || randSpot.y > corners.endY) {
                var stoneType = rand(0, 8);
                t.b = 2 + stoneType;
                t.bT = 36 + stoneType;
            }
        }
    }
};


MapGenerator.growFruit = function() {
    var x = rand(1, map.SIZE - 1);
    for(var y = rand(1, 3); y < map.SIZE; y += 3) {
        var t = map.m[x][y];
        if(t.b > 1) {
            var b = Building.b[t.b];
            if(b.hasOwnProperty("regrowTo")) {
                t.b = b.regrowTo[0];
                t.bT = b.regrowTo[1];
            }
        }
    }
};
