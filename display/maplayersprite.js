/** sample json
var row = 11;
var column = 11;
var layerData = {
            "name":"floor",
            "tiles": {
                "m_town" : [
                        0, 0, 0, 0, 0,-1,-1,-1, 0, 0, 0,
                        0,-1, 0, 0, 0,-1, 0,-1, 0, 0, 0,
                        0,-1,-1,-1,-1,-1,-1,-1, 0, 0, 0,
                        0,-1, 0,-1,-1,-1, 0, 0, 0,-1, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
                        ],
                "cobbleOnGrass" : [
                        -1,-1,-1,-1,-1, 0, 0, 0,-1,-1,-1,
                        -1, 0,-1,-1,-1, 0,-1, 0,-1,-1,-1,
                        -1, 0, 0, 0, 0, 0, 0, 0,-1,-1,-1,
                        -1, 0,-1, 0, 0, 0,-1,-1,-1, 0,-1,
                        -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
                        -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
                        -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
                        -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
                        -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
                        -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
                        -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1
                ]
            }
        }

var tileset = {
    "name": "townset",
    "chipset": [{
        "name": "m_town",
        "path": "img/MapChip/nekura1/m_town.png",
        "type": "tileset"
    }, {
        "name": "cobbleOnGrass",
        "path": "img/MapChip/nekura1/t_town02.png",
        "type": "auto"
    }]
}
**/

(function() {
    window.tmutil = window.tmutil || {};
    window.tmutil.display = window.tmutil.display || {};

    window.tmutil.display.getUpLeftCoord = function(width, height) {
        return tm.geom.Vector2(- 1 * width / 2, -1 * height / 2);
    };

    tm.define('tmutil.display.MapLayerSprite', {
        superClass: "tm.display.Shape",

        tileset: {},
        tiles: {},
        row: 0,
        column: 0,
        config: {},
        debug: false,

        init: function(layerData, row, column, tileset, config) {

            this.tiles = layerData["tiles"];
            this.column = column;
            this.tileset = tileset;

            this.row = row;
            this.config = config || {
                "CHIP_WIDTH":32,
                "CHIP_HEIGHT":32
            };

            this.superInit({
                width: this.getWidthPx(),
                height: this.getHeightPx()
            });

            this.buildCanvas();
        },

        getTileAt: function(coord) {
            var upleft = tmutil.display.getUpLeftCoord(this.getWidthPx(), this.getHeightPx());
            var tx = Math.floor((coord.x - upleft.x) / this.config.CHIP_WIDTH);
            var ty = Math.floor((coord.y - upleft.y) / this.config.CHIP_HEIGHT);
            var ret = this.getTileAtByChipCoord(tx, ty);
            ret.coord = this.chipCoordToCoord(tx, ty);
            return ret;
        },

        chipCoordToCoord: function(cx, cy) {
            var upleft = tmutil.display.getUpLeftCoord(this.getWidthPx(), this.getHeightPx());
            var x = upleft.x + (cx * this.config.CHIP_WIDTH) + (this.config.CHIP_WIDTH / 2);
            var y = upleft.y + (cy * this.config.CHIP_HEIGHT) + (this.config.CHIP_HEIGHT / 2);
            return tm.geom.Vector2(x, y);
        },

        arrayCountToChipCoord: function(i) {
            return tm.geom.Vector2((i % this.column), Math.floor(i / this.column));
        },

        chipCoordToArrayCount: function(cx, cy) {
            return cx + cy * this.column;
        },

        getChipCoord: function(coord) {
            var upleft = tmutil.display.getUpLeftCoord(this.getWidthPx(), this.getHeightPx());
            var tx = Math.floor((coord.x - upleft.x) / this.config.CHIP_WIDTH);
            var ty = Math.floor((coord.y - upleft.y) / this.config.CHIP_HEIGHT);
            return tm.geom.Vector2(tx, ty);
        },

        /***
         * ChipCoord : upleft is (0, 0), downright is (this.column, this.row)
         ***/
        getTileAtByChipCoord: function(x, y) {
            // rpg.log("current:" + x + "," + y);
            var retObj = {
                "chipset": null,
                "tile": -1,
                "coord": null,
                "chipCoord": {
                    "x": x,
                    "y": y
                }

            };
            for (var chipset in this.tiles) {
                var tiledata = this.tiles[chipset];
                var tile = tiledata[this.chipCoordToArrayCount(x, y)];
                if (tile != -1) {
                    retObj.tile = tile;
                    retObj.chipset = chipset;
                    return retObj;
                }
            }
            return retObj;
        },

        buildCanvas: function() {
            var chipsets = this.tileset.chipset;
            //draw per chipset
            for (var k = 0; k < chipsets.length; k++) {
                var chipset = chipsets[k];
                var key = chipset["name"];
                var chipdata = this.tiles[key];
                if (chipdata) {
                    if (chipset["type"] === "auto") {
                        this.drawAutotile(chipdata, key);
                    } else {
                        this.drawNormalTiles(chipdata, key);
                    }
                }
            }
            if (this.debug) {
                for (var r = 0; r < this.row; r++) {
                    for (var c = 0; c < this.column; c++) {
                        this.canvas.strokeRect(c * this.config.CHIP_WIDTH, r * this.config.CHIP_HEIGHT, this.config.CHIP_WIDTH, this.config.CHIP_HEIGHT);
                    }
                }
            }
        },

        drawNormalTiles: function(chipdata, chipname) {
            var atlas = tm.asset.Manager.get(chipname)["element"];
            for (var i = 0; i < this.row * this.column; i++) {
                if (i < chipdata.length && this.shouldDraw(chipdata[i])) {
                    var src = this.getSrcRectOfChip(chipdata[i]);
                    var dst = this.getDstRectOfChip(i);
                    this.canvas.drawImage(atlas,
                        src.x, src.y, src.w, src.h,
                        dst.x, dst.y, dst.w, dst.h);
                }
            }
        },

        shouldDraw: function(chipid) {
            return chipid != -1;
        },

        getWidthPx: function() {
            return this.column * this.config.CHIP_WIDTH;
        },

        getHeightPx: function() {
            return this.row * this.config.CHIP_HEIGHT;
        },

        getDstRectOfChip: function(i) {
            var dx = (i % this.column) * this.config.CHIP_WIDTH;
            var dy = Math.floor(i / this.column) * this.config.CHIP_HEIGHT;
            var dw = this.config.CHIP_WIDTH;
            var dh = this.config.CHIP_HEIGHT;
            var d = {
                x: dx,
                y: dy,
                w: dw,
                h: dh
            };
            return d;
        },

        drawAutotile: function(chipdata, chipname) {
            for (var i = 0; i < this.row * this.column; i++) {
                if (i < chipdata.length && this.shouldDraw(chipdata[i])) {
                    this.drawOneAutoTile(this.canvas, chipname, i);
                }
            }
        },

        drawOneAutoTile: function(canvas, chipname, i) {
            var chipCoord = this.arrayCountToChipCoord(i);
            var atlas = tm.asset.Manager.get(chipname)["element"];
            /**
             * [0,0][1,0]
             * [0,1][1,1]
             * split 4 per 1 tile.
             **/
            for (var x = 0; x <= 1; x++) {
                for (var y = 0; y <= 1; y++) {
                    //which corner to check
                    var cx = (x == 0 ? chipCoord.x - 1 : chipCoord.x + 1);
                    var cy = (y == 0 ? chipCoord.y - 1 : chipCoord.y + 1);
                    //which to check, top or bottom
                    var tby = (y == 0 ? chipCoord.y - 1 : chipCoord.y + 1);
                    //which to check, left or right
                    var lrx = (x == 0 ? chipCoord.x - 1 : chipCoord.x + 1);

                    var cornerTile = this.getTileAtByChipCoord(cx, cy);
                    var lrTile = this.getTileAtByChipCoord(lrx, chipCoord.y);
                    var tbTile = this.getTileAtByChipCoord(chipCoord.x, tby);

                    var src = {};
                    src.w = this.config.CHIP_WIDTH / 2;
                    src.h = this.config.CHIP_HEIGHT / 2;

                    var row = 0;
                    //check which tile we should use

                    if (chipname == cornerTile.chipset && chipname == lrTile.chipset && chipname == tbTile.chipset) {
                        row = 4;
                    } else if (chipname == lrTile.chipset && chipname == tbTile.chipset) {
                        row = 3;
                    } else if (chipname == lrTile.chipset) {
                        row = 2;
                    } else if (chipname == tbTile.chipset) {
                        row = 1;
                    }

                    src.x = x * this.config.CHIP_WIDTH / 2; //column
                    src.y = (y * this.config.CHIP_HEIGHT / 2) + this.config.CHIP_HEIGHT * row; //row

                    var dst = this.getDstRectOfChip(i);
                    dst.x += x * this.config.CHIP_WIDTH / 2;
                    dst.w /= 2;
                    dst.y += (y * this.config.CHIP_HEIGHT / 2);
                    dst.h /= 2;
                    canvas.drawImage(atlas,
                        src.x, src.y, src.w, src.h,
                        dst.x, dst.y, dst.w, dst.h);
                }
            }

        },

        getSrcRectOfChip: function(id) {
            var srcX = id % this.config.CHIP_COLUMN;
            var srcY = Math.floor(id / this.config.CHIP_COLUMN);
            var rect = {
                x: srcX * this.config.CHIP_WIDTH,
                y: srcY * this.config.CHIP_HEIGHT,
                w: this.config.CHIP_WIDTH,
                h: this.config.CHIP_HEIGHT
            };
            return rect;
        }
    });
})();