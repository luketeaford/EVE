EVE.gateOn = function gateOn(e) {
    'use strict';
    var peak = EVE.synth.currentTime + parseFloat(EVE.program.vca_a),
        i,
        vca,
        osc,
        env;

    // Harmonic Envelopes
    for (i = 1; i <= EVE.config.harmonics; i += 1) {

        vca = EVE.harmonicOsc['osc' + i].vca;
        osc = EVE.program['osc' + i];
        env = EVE.program['osc' + i + '_eg'];

        // Timbre starting point
        vca.gain.setTargetAtTime(osc, EVE.now(), 0.1);

        // Timbre attack
        vca.gain.linearRampToValueAtTime(parseFloat(osc) + parseFloat(env), EVE.now() + parseFloat(EVE.program.timbre_a));

        // Timbre decay
        vca.gain.setTargetAtTime(osc + (env * EVE.program.timbre_s), EVE.now() + parseFloat(EVE.program.timbre_a), EVE.program.timbre_d);
    }

    // Set starting point
    EVE.vca.gain.setTargetAtTime(EVE.program.vca_g, EVE.now(), 0.1);

    // Attack
    EVE.vca.gain.linearRampToValueAtTime(1, peak);

    // Decay
    EVE.vca.gain.setTargetAtTime(EVE.program.vca_s + EVE.program.vca_g, peak, EVE.program.vca_d);

    return EVE.calculatePitch(e.target.dataset.noteValue);
};

EVE.keyboard.addEventListener('mousedown', EVE.gateOn);
EVE.keyboard.addEventListener('touchstart', EVE.gateOn);
