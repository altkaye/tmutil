(function() {
    window.tmutil = window.tmutil || {};
    window.tmutil.display = window.tmutil.display || {};
    tm.define("tmutil.display.Panel", {
        superClass: "tm.display.Shape",
        width: null,
        height: null,
        windowImg:null,

        init: function(pWidth, pHeight, pWindowImage) {
            if (this.pWidth.width && this.pWidth.height && this.pWidth.pWindowImage) {
                this.windowImg = this.pWidth.pWindowImage;
                this.superInit(pWidth);
            } else {
                pWidth = pWidth ? pWidth : 30;
                pHeight = pHeight ? pHeight : 30;
                var param = {
                    width:pWidth,
                    height:pHeight,
                }
                this.windowImg = pWindowImage ? pWindowImage : 'window';
                this.superInit(param);
            }
            this.buildCanvas();
        },

        buildCanvas: function() {
            var image = tm.asset.Manager.get(this.windowImg)["element"];
            var src = {};
            src.w = image.width / 3;
            src.h = image.height / 3;

            var centerX = src.w;
            var centerY = src.h;
            var centerW = this.width - (src.w * 2);
            var centerH = this.height - (src.h * 2);

            // corner
            for (var i = 0; i <= 1; i++) {
                for (var k = 0; k <= 1; k++) {
                    var dst = {};
                    dst.x = (centerX + centerW) * i;
                    dst.w = src.w;
                    dst.y = (centerY + centerH) * k;
                    dst.h = src.h;
                    src.x = src.w * i * 2;
                    src.y = src.h * k * 2;

                    this.canvas.drawImage(image, src.x, src.y, src.w, src.h,
                        dst.x, dst.y, dst.w, dst.h);
                }
            }

            // top and bottom
            for (var i = 0; i <= 1; i++) {
                var dst = {};
                dst.x = src.w;
                dst.y = (centerY + centerH) * i;
                dst.w = centerW;
                dst.h = src.h;
                src.x = src.w;
                src.y = i * 2 * src.h;

                this.canvas.drawImage(image, src.x, src.y, src.w, src.h,
                    dst.x, dst.y, dst.w, dst.h);
            }

            //left and right
            for (var i = 0; i <= 1; i++) {
                var dst = {};
                dst.x = (centerX + centerW) * i;
                dst.y = centerY;
                dst.w = src.w;
                dst.h = centerH;
                src.x = src.w * i * 2;
                src.y = src.h;
                this.canvas.drawImage(image, src.x, src.y, src.w, src.h,
                    dst.x, dst.y, dst.w, dst.h);
            }

            //center
            src.x = src.w;
            src.y = src.h;
            this.canvas.drawImage(image, src.x, src.y, src.w, src.h,
                centerX, centerY, centerW, centerH);
        }
    });
})();
