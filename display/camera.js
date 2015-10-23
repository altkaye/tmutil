(function() {
    window.tmutil = window.tmutil || {};
    window.tmutil.display = window.tmutil.display || {};
    tm.define("tmutil.display.Camera", {
        superClass: "tm.display.Shape",
        target: null,
        center: null,

        init: function(target, center, width, height) {
            this.superInit(width, height);
            this.set(target, center);
        },

        set: function(target, center) {
            this.target = target;
            this.center = center;
        },

        update: function(app) {
            if (this.center !== null && this.target !== null) {
                var d = this.center.position;
                var x = this.width - d.x;
                var y = this.height - d.y;
                if (this.target.position.x !== x || this.target.position.y !== y) {
                    this.target.setPosition(x, y);
                }
            }
        }
    });
})();