EVE = (function (module) {
    'use strict';
    var fft = 1024,
        scope = document.querySelector('#oscilloscope'),
        context = scope.getContext('2d'),
        lineColor = 'rgb(51, 58, 52)',// dark grey
        scopeData = new Uint8Array(fft),
        scopeHeight = scope.height,
        scopeWidth = scope.width;

    module.oscilloscope = module.createAnalyser();

    (function draw() {
        var sliceWidth = scopeWidth / fft,
            x = 0,
            i,
            v,
            y;

        window.requestAnimationFrame(draw);

        context.clearRect(0, 0, scopeWidth, scopeHeight);
        context.lineWidth = 2;
        context.strokeStyle = lineColor;
        context.beginPath();
        module.oscilloscope.getByteTimeDomainData(scopeData);
        for (i = 0; i < fft; i += 1) {
            v = scopeData[i] / 128;
            y = v * scopeHeight / 2;

            if (i === 0) {
                context.moveTo(x, y);
            } else {
                context.lineTo(x, y);
            }
            x += sliceWidth;
        }
        context.lineTo(scopeWidth, scopeHeight / 2);
        context.stroke();
    }());

    return module;
}(EVE));
