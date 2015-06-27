EVE.gateOn = function gateOn(e) {
    'use strict';
    var env,
        i,
        osc,
        peak = EVE.synth.currentTime + EVE.program.vca_a + EVE.config.eg_minimum,
        vca;

    // TODO Possibly use a timbrePeak variable in this loop for readability
    // Timbre Envelope
    for (i = 1; i <= 8; i += 1) {

        //vca, osc, env
        env = EVE.program['osc' + i + '_eg'];
        osc = EVE.program['osc' + i];
        vca = EVE.harmonicOsc['osc' + i].vca;

        // Timbre starting point
        vca.gain.setTargetAtTime(osc, EVE.now(), 0.1);

        // Timbre attack
        vca.gain.linearRampToValueAtTime(osc + env, EVE.now() + EVE.program.timbre_a + EVE.config.eg_minimum);

        // Timbre decay
        vca.gain.setTargetAtTime(osc + (env * EVE.program.timbre_s), EVE.now() + EVE.program.timbre_a + EVE.config.eg_minimum, EVE.program.timbre_d);
    }

    // Set starting point
    EVE.vca.gain.setTargetAtTime(EVE.program.vca_g, EVE.now(), 0.1);

    // Attack
    EVE.vca.gain.linearRampToValueAtTime(1, peak);

    // Decay
    EVE.vca.gain.setTargetAtTime(EVE.program.vca_s + EVE.program.vca_g, peak, EVE.program.vca_d);

    return EVE.calculatePitch(e.target.dataset.noteValue);

};

EVE.keyboard.scope.addEventListener('mousedown', EVE.gateOn);
EVE.keyboard.scope.addEventListener('touchstart', EVE.gateOn);
