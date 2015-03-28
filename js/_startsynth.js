EVE.start_synth = function () {
    'use strict';

    // Harmonic Oscillators
    EVE.osc1.start(0);
    EVE.osc2.start(0);
    EVE.osc3.start(0);
    EVE.osc4.start(0);
    EVE.osc5.start(0);
    EVE.osc6.start(0);
    EVE.osc7.start(0);
    EVE.osc8.start(0);

    // LFOs
    EVE.lfo.start(0);
    EVE.tremolo.start(0);
    EVE.vibrato.start(0);

    // Prevent any future events from calling start_synth
    $('#keyboard').off('mousedown keydown touchstart', 'button', EVE.start_synth);

    EVE.start_synth = function () {
        return undefined;
    };
};
