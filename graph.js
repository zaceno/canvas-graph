var Rect = require('canvas-rect');

var copyProps = function (target, source, overrides) {
    var key, val;
    overrides = overrides || {};
    for (key in source) {
        if (!source.hasOwnProperty(key)) continue;
        target[key] = (typeof overrides[key] === 'undefined') ? source[key] : overrides[key];
    }
    return target;
};

var drawGraph = function (carta, opt) {

    var MAXX = opt.maxx,
        MINX = opt.minx,
        MAXY = opt.maxy,
        MINY = opt.miny,
        MAJORX = opt.majorx,
        MAJORY = opt.majory,
        MINORX = opt.minorx,
        MINORY = opt.minory,
        crossX = Math.max(Math.min(0, MAXX), MINX),
        crossY = Math.max(Math.min(0, MAXY), MINY),
        ctx,
        rect;


    var drawArrow = function (ctx) {
        ctx.moveTo(0, 0);
        ctx.lineTo(3, 1);
        ctx.lineTo(0, 2);
        ctx.lineTo(1, 1);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };

    var drawEastArrow = function (rect) {
        rect.rel(1,0)
        .width(20).height(8).hline()
        .rel(1,0).width(10).offset(-10,-4)
        .projectDrawing(drawArrow, 3, 2, 0);
    };

    var drawWestArrow = function (rect) {
        rect.width(20).height(8).offset(-20,0).hline()
        .width(10).offset(0,-4)
        .projectDrawing(drawArrow, 3, 2, Math.PI);
    };

    var drawNorthArrow = function (rect) {
        rect.height(20).offset(0,-20).vline()
        .height(10).width(8).offset(-4,0)
        .projectDrawing(drawArrow,3,2,Math.PI*1.5);
    };

    var drawSouthArrow = function (rect) {
        rect.rel(0,1).height(20).vline()
        .rel(0,1).height(10).width(8).offset(-4,-10)
        .projectDrawing(drawArrow, 3, 2, Math.PI*0.5);
    }

    var drawXTick = function  (x) {
        if (x === crossX) return;
        carta.rect(x, crossY)
        .rel(0,1).height(5).vline()
        .offset(0,20).text(opt.xTickFormat(x), 0, 0);
    };

    var drawYTick = function (y) {
        if (y === crossY) return;
        carta.rect(crossX, y)
        .rel(0,1).width(5).offset(-5,0).hline()
        .offset(-8,3).text(opt.yTickFormat(y), 0, 0);
    };

    var rangeTicks = function (min, max, step)  {
        var incr = function (y) {
                return (Math.floor((y+step)/step + 0.0000001 ) ) * step;
            },
            x = incr(min),
            t = [];
        while (x < max) {
            t.push(x);
            x = incr(x);
        }
        return t;
    };

    var drawXAxis = function () {
        var xAxis = carta.rect(MINX, crossY).rel(0,1).hline();
        if (crossX < MAXX) drawEastArrow(xAxis);
        if (MINX < crossX) drawWestArrow(xAxis);
        ctx.textAlign = 'center';
        rangeTicks(MINX, MAXX, MAJORX).forEach(drawXTick);
        xAxis.rel(1,0).offset(0,40).mapDrawing(function (ctx) {
            ctx.textAlign = 'right';
            ctx.fillStyle = ctx.strokeStyle;
            ctx.fillText(opt.labelx, 0,0);
        });
    };

    var drawYAxis = function () {
        var yAxis = carta.rect(crossX, MINY).vline();
        if (crossY < MAXY) drawNorthArrow(yAxis);
        if (MINY < crossY) drawSouthArrow(yAxis);
        ctx.textAlign = 'right';
        rangeTicks(MINY, MAXY, MAJORY).forEach(drawYTick);
        yAxis.offset(-30,0).mapDrawing(function (ctx) {
           ctx.rotate(-Math.PI*0.5);
           ctx.textAlign = 'right';
           ctx.fillText(opt.labely, 0, 0);
        });
    };

    var drawMinorGrid = function () {
        rangeTicks(MINX, MAXX, MINORX).forEach(function (x) { carta.vline(x); });
        rangeTicks(MINY, MAXY, MINORY).forEach(function (y) { carta.hline(y); });
    };

    var drawMajorGrid = function () {
        rangeTicks(MINX, MAXX, MAJORX).forEach(function (x) { carta.vline(x); });
        rangeTicks(MINY, MAXY, MAJORY).forEach(function (y) { carta.hline(y); });
    };



    rect = carta.rect();
    ctx = rect.ctx;
    rect.fill();
    ctx.save();
        ctx.globalAlpha *= 0.3;
        ctx.save();
            ctx.globalAlpha *= 0.3;
            drawMinorGrid();
        ctx.restore();
        drawMajorGrid();
    ctx.restore();
    ctx.save()
        ctx.font = '12px monospace';
        ctx.fillStyle = ctx.strokeStyle;
        drawXAxis();
        drawYAxis();
    ctx.restore();
};



var defaults = {
    minx: 0,
    maxx: 1,
    majorx: 1,
    minorx: 1,
    miny: 0,
    maxy: 1,
    majory: 1,
    minory: 1,
    labelx: '',
    labely: '',
    xTickFormat: function (n) {return '' + n;},
    yTickFormat: function (n) {return '' + n;},
};



var Graph = function (opts) {
    copyProps(this, defaults, opts);
    this._plots = [];
};

Graph.prototype.set = function (props) {
    copyProps(this, this, props)
};

Graph.prototype._carta = function (rect) {
    return rect.inset(50).cartesian(
        this.minx,
        this.maxx,
        this.miny,
        this.maxy
    )
};

Graph.prototype.draw = function (ctx, width, height) {
    var rect;
    if (ctx instanceof Rect) {
        rect = ctx;
    } else {
        rect = new Rect(ctx, width, height);
    }
    rect.fill();
    var carta = this._carta(rect)
    drawGraph(this._carta(rect), this);
    return carta;
};

Graph.plot = require('./plot');

module.exports = Graph;
