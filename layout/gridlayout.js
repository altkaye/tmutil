
(function() {
    window.tmutil = window.tmutil || {};
    window.tmutil.layout = window.tmutil.layout || {};
    tm.define("tmutil.layout.GridLayout", {
        superClass:"tm.display.Shape",
        width:0,
        unitWidth:0,
        unitHeight:0,
        height:0,
        col: 1,
        row: 1,

        init: function(col, row, width, height) {
            this.width = width || 300;
            this.height = height || 300;
            this.superInit({
                width:this.width,
                height:this.height
            });
            this.col = col;
            this.row = row;
            this.unitWidth = this.width / this.col;
            this.unitHeight = this.height / this.row;

            //this._debug();
        },

        getUpLeftCoord:function() {
            return tm.geom.Vector2(- this.width / 2, - this.height / 2);
        },

        _debug:function() {
            tm.display.RectangleShape(this.width, this.height).addChildTo(this);
            for (var x = 0; x < this.col; x++) {
                for (var y = 0; y < this.row; y++) {
                    this.addChildInLayout(tm.display.Label("(" + (x + 1) + "," + (y + 1) + ")", 12), x + 1, y + 1);
                }
            }
            return this;
        },

        addChildInLayout:function(child, x, y) {
            x = x || 1;
            y = y || 1;
            var p = this.getPositionAt(x, y);
            this.addChild(child);
            child.setPosition(p.x, p.y);
        },

        getPositionAt:function(x, y) {
            var ul = this.getUpLeftCoord();
            var px = ul.x + this.getWidthOf(x) - this.unitWidth / 2;
            var py = ul.y + this.getHeightOf(y) - this.unitHeight / 2;
            return tm.geom.Vector2(px, py);
        },

        getWidthHeight:function(spanX, spanY) {
            return {
                width:this.getWidthOf(spanX),
                height:this.getHeightOf(spanY)
            };
        },

        getWidthOf: function(span) {
            return span * this.unitWidth;
        },

        getHeightOf: function(span) {
            return span * this.unitHeight;
        }
    });
})();
