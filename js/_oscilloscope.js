// TODO Figure out what 128 means
EVE = (function (module) {
    'use strict';
    var fft = 1024,
        oscope = document.getElementById('scope'),
        ctx = oscope.getContext('2d'),
        lineColor = 'rgb(51, 58, 52)',// dark grey
        scopeData = new Uint8Array(fft),
        scopeHeight = 150,
        scopeWidth = 300;

    module.oscilloscope = module.createAnalyser();

    (function draw() {
        var sliceWidth = scopeWidth / fft,
            x = 0,
            i,
            v,
            y;

        window.requestAnimationFrame(draw);

        ctx.clearRect(0, 0, scopeWidth, scopeHeight);
        ctx.lineWidth = 2;
        ctx.strokeStyle = lineColor;
        ctx.beginPath();
        module.oscilloscope.getByteTimeDomainData(scopeData);
        for (i = 0; i < fft; i += 1) {
            v = scopeData[i] / 128;
            y = v * scopeHeight / 2;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            x += sliceWidth;
        }
        ctx.lineTo(scopeWidth, scopeHeight / 2);
        ctx.stroke();
    }());

    return module;
}(EVE));
