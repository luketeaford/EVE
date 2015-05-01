EVE.gateOn = function gateOn(e) {
    'use strict';
    var peak = EVE.synth.currentTime + EVE.program.vca_a,
        i;

    // Harmonic Envelopes
    for (i = 1; i < EVE.config.harmonics + 1; i += 1) {
        //needs to rise from EVE.program.osc[i] to... ?
        // Timbre starting point
        EVE['osc' + i + '_vca'].gain.setTargetAtTime(EVE.program['osc' + i], EVE.now(), 0.1);

        // Timbre attack NOTE 1 is wrong
        EVE['osc' + i + '_vca'].gain.linearRampToValueAtTime(EVE.program['osc' + i], EVE.synth.currentTime + EVE.program.env_a);

        // Timbre decay
        EVE['osc' + i + '_vca'].gain.setTargetAtTime(EVE.program['osc' + i], EVE.synth.currentTime + EVE.program.env_a, EVE.program.env_d);
    }


    // Set starting point
    EVE.vca.gain.setTargetAtTime(EVE.program.vca_g, EVE.synth.currentTime, 0.1);

    // Attack
    EVE.vca.gain.linearRampToValueAtTime(1, peak);

    // Decay
    EVE.vca.gain.setTargetAtTime(EVE.program.vca_s + EVE.program.vca_g, peak, EVE.program.vca_d);

    return EVE.calculatePitch(e.target.dataset.noteValue);
};

EVE.keyboard.addEventListener('mousedown', EVE.gateOn);
EVE.keyboard.addEventListener('touchstart', EVE.gateOn);
