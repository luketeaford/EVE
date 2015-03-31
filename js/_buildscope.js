EVE.build_scope = function build_scope() {
    'use strict';

    // Canvas parts
    EVE.oscope = document.getElementById('scope');
    EVE.ctx = EVE.oscope.getContext('2d');

    // Oscilloscope
    EVE.oscilloscope = EVE.synth.createAnalyser();
    EVE.oscilloscope.fftSize = 2048;
    EVE.vca.connect(EVE.oscilloscope);

    EVE.scope_data = new Uint8Array(2048);

    // Start drawing
    function draw() {
        var sliceWidth = 300 / 2048,
            x = 0,
            i,
            v,
            y;

        window.requestAnimationFrame(draw);

        EVE.ctx.clearRect(0, 0, 300, 150);
        EVE.ctx.lineWidth = 2;
        EVE.ctx.strokeStyle = 'rgb(242, 219, 33)';
        EVE.ctx.beginPath();
        EVE.oscilloscope.getByteTimeDomainData(EVE.scope_data);
        for (i = 0; i < 2048; i += 1) {
            v = EVE.scope_data[i] / 128;
            y = v * 150 / 2;

            if (i === 0) {
                EVE.ctx.moveTo(x, y);
            } else {
                EVE.ctx.lineTo(x, y);
            }
            x += sliceWidth;
        }
        EVE.ctx.lineTo(300, 150 / 2);
        EVE.ctx.stroke();
    }

    draw();

    EVE.build_scope = function build_scope() {
        return undefined;
    };
};
