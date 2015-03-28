$(document).ready(function () {
    'use strict';
    EVE.build_synth();

    // Slider controls
    $('#harmonics').on('mousedown touchstart', 'input', EVE.slider.grab);

    $('#keyboard')
        // Start oscillators
        .one('mousedown keydown touchstart', 'button', EVE.start_synth)
        // Synth keys
        .on('mousedown touchstart', 'button', EVE.gate_on)
        .on('mouseup touchend', 'button', EVE.gate_off);
});
