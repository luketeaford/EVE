EVE.buildScope = function buildScope() {
    'use strict';
    var fft = 2048;

    // Canvas
    EVE.oscope = document.getElementById('scope');
    EVE.ctx = EVE.oscope.getContext('2d');// Not totally sure what this does

    // Oscilloscope
    EVE.oscilloscope = EVE.synth.createAnalyser();
    //EVE.oscilloscope.fftSize = 2048;//TODO Doesn't need to be attached to EVE
    EVE.vca.connect(EVE.oscilloscope);//TODO Could be in build synth, all this

    EVE.scope_data = new Uint8Array(fft);

    // Start drawing
    function draw() {
        var sliceWidth = 300 / fft,// canvas/fft
            x = 0,
            i,
            v,
            y;

        window.requestAnimationFrame(draw);

        EVE.ctx.clearRect(0, 0, 300, 150);//canvas size
        EVE.ctx.lineWidth = 2;
        EVE.ctx.strokeStyle = 'rgb(255, 255, 0)';//TODO Get actual gold color
        EVE.ctx.beginPath();
        EVE.oscilloscope.getByteTimeDomainData(EVE.scope_data);
        for (i = 0; i < fft; i += 1) {
            v = EVE.scope_data[i] / 128;
            y = v * 150 / 2;

            if (i === 0) {
                EVE.ctx.moveTo(x, y);
            } else {
                EVE.ctx.lineTo(x, y);
            }
            x += sliceWidth;
        }
        EVE.ctx.lineTo(300, 150 / 2);//canvas size
        EVE.ctx.stroke();
    }

    draw();

    EVE.buildScope = function buildScope() {
        console.warn('buildScope already called');
        return 'Scope already built';
    };
};
