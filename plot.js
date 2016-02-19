module.exports = {
    lines: function (rect, data) {
        var s = data;
        rect.mapDrawing(function (ctx) {
            ctx.beginPath();
            ctx.moveTo(s[0][0], s[0][1]);
            for (var i = 1; i < s.length; i++) {
               ctx.lineTo(s[i][0], s[i][1]);
            }
            ctx.stroke();
        });
    },
    area: function (rect, data, clipping, bottom) {
        c = clipping || null;
        bottom = bottom || 0;
        var s = data;
        rect.mapDrawing(function (ctx) {
            ctx.beginPath();
            ctx.moveTo(s[0][0], bottom);
            for (var i = 0; i < s.length; i ++){
                ctx.lineTo(s[i][0], s[i][1]);
            }
            ctx.lineTo(s[i-1][0], bottom);
            ctx.lineTo(s[0][0], bottom);
            if (c) {
                ctx.lineTo(c[c.length-1][0], bottom);
                for (var j = c.length-1; j >= 0; j--) {
                    ctx.lineTo(c[j][0], c[j][1]);
                }
                ctx.lineTo(c[0][0], bottom);
                ctx.lineTo(c[c.length-1][0], bottom);
            }
            ctx.fill();
        });
    },
    dots: function (rect, data, size) {
        data.forEach(function (p) {
            rect.pixelDraw(p[0], p[1], function (ctx) {
               ctx.beginPath();
               ctx.arc(0, 0, (size || 3), 0, Math.PI*2);
               ctx.stroke();
               ctx.fill();
           });
        });
    }
}
