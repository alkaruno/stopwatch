var Stopwatch = (function () {

    var summa = 0;
    var started = null;
    var rects = [];
    var currentStr = null;

    var raphael = null;

    var options = {
        digits: 5,
        size: 15,
        space: 1,
        color: '#fc3',
        bgcolor: '#222',
        animationSpeed: 200
    };

    var font = [
        '00000     0 00000 00000 0   0 00000 00000 00000 00000 00000            ',
        '0   0     0     0     0 0   0 0     0         0 0   0 0   0   0        ',
        '0   0     0     0     0 0   0 0     0         0 0   0 0   0            ',
        '0   0     0 00000 00000 00000 00000 00000     0 00000 00000            ',
        '0   0     0 0         0     0     0 0   0     0 0   0     0            ',
        '0   0     0 0         0     0     0 0   0     0 0   0     0   0        ',
        '00000     0 00000 00000     0 00000 00000     0 00000 00000            '
    ];

    var Stopwatch = function () {

        initDigits(options.digits);

        for (i = 0; i < options.digits * 6; i++) {
            rects[i] = [];
            for (var y = 0; y < 7; y++) {
                rects[i][y] = raphael.rect(i * (options.size + options.space), y * (options.size + options.space), options.size, options.size).attr({
                    'fill': options.bgcolor,
                    'stroke': null
                });
            }
        }

        if (store.enabled) {
            summa = store.get('summa') || 0;
            started = store.get('started') || null;
        }

        updateUi();

        setInterval(run, 100);

        $('#stopwatch-button').click(startPause);
        $('#stopwatch-reset').click(reset);
        $(document).keypress(function (e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if (code == 32) {
                startPause();
            } else if (code == 82 || code == 114 || code == 1050 || code == 1082) {
                reset();
            }
        });
    };

    var run = function () {
        if (started != null) {
            var now = new Date();
            writeTime(now.getTime() - started + summa);
        } else {
            writeTime(summa);
        }
    };

    var startPause = function () {
        var now = new Date();
        if (started == null) {
            started = now.getTime();
        } else {
            summa += now.getTime() - started;
            started = null;
        }

        updateStorage();
        updateUi();
    };

    var reset = function () {
        started = null;
        summa = 0;
        updateStorage();
        updateUi();
        writeTime(0);
    };

    var updateStorage = function () {
        store.set('summa', summa);
        store.set('started', started);
    };

    var updateUi = function () {
        $('#stopwatch-button').html((started != null) ? 'Pause' : 'Start');
        $('#favicon').attr('href', (started != null) ? 'http://cdn4.iconfinder.com/data/icons/defaulticon/icons/png/16x16/media-pause.png' : 'http://cdn4.iconfinder.com/data/icons/defaulticon/icons/png/16x16/media-play.png');
    };

    var writeTime = function (time) {

        var on = started == null || (time % 1000 < 500);

        time *= 0.001;
        var hour = Math.floor(time / 3600);
        time -= 3600 * hour;
        var mins = Math.floor(time / 60);
        time -= 60 * mins;
        var secs = Math.floor(time);

        var str = (hour > 0 ? hour + ':' : '') + (mins < 10 ? '0' : '') + mins + (on ? ':' : ' ') + (secs < 10 ? '0' : '') + secs;

        if (str != currentStr) {
            updateRects(str);
            document.title = str;
            currentStr = str;
        }
    };

    var initDigits = function (digits) {

        var w = digits * 6 * (options.size + options.space) - (options.size + 2 * options.space);
        var h = 7 * (options.size + options.space) - options.space;

        if (raphael == null) {
            raphael = Raphael('stopwatch-value', w, h);
        } else {
            raphael.setSize(w, h);
        }

        for (i = 0; i < options.digits * 6; i++) {
            rects[i] = [];
            for (var y = 0; y < 7; y++) {
                rects[i][y] = raphael.rect(i * (options.size + options.space), y * (options.size + options.space), options.size, options.size).attr({
                    'fill': options.bgcolor,
                    'stroke': null
                });
            }
        }

        $('#wrapper').center();
    };

    var updateRects = function (str) {

        if (str.length > options.digits) {
            options.digits = str.length;
            initDigits(options.digits);
        }

        var symbol;
        for (var l = 0; l < str.length; l++) {
            str.charAt(l) == ':' ? symbol = 10 : (str.charAt(l) == ' ' ? symbol = 11 : symbol = str.charAt(l));
            for (var x = 0; x < 6; x++) {
                for (var y = 0; y < 7; y++) {
                    if (font[y].charAt(symbol * 6 + x) == '0' && rects[l * 6 + x][y].attrs.fill == options.bgcolor) {
                        rects[l * 6 + x][y].animate({
                            'fill': options.color
                        }, options.animationSpeed);
                    } else if (font[y].charAt(symbol * 6 + x) == ' ' && rects[l * 6 + x][y].attrs.fill == options.color) {
                        rects[l * 6 + x][y].animate({
                            'fill': options.bgcolor
                        }, options.animationSpeed);
                    }
                }
            }
        }

    };

    Stopwatch.prototype = {
        constructor: Stopwatch
    };

    return Stopwatch;

})();

$(function () {
    new Stopwatch();
});