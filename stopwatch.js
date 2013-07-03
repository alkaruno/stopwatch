var Stopwatch = (function () {

    var summa = 0;
    var started = null;
    var currentStr = null;

    var Stopwatch = function () {

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
            var html = '';
            for (var i = 0, len = str.length; i < len; i++) {
                var char = str.charAt(i);
                if (char == ':' || char == ' ') {
                    html += '<span class="colon">' + char + '</span>'
                } else {
                    html += '<span>' + char + '</span>'
                }
            }
            $('#stopwatch-value').html(html);
            document.title = str;
            currentStr = str;
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