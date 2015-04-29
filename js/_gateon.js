EVE.gateOn = function gateOn(e) {
    'use strict';

    // Closures don't make sense for this

    function ampAttack() {
        var peak = EVE.synth.currentTime + EVE.program.vca_a;

        // Attack
        EVE.vca.gain.linearRampToValueAtTime(1, peak);

        // Decay
        EVE.vca.gain.setTargetAtTime(EVE.program.vca_s + EVE.program.vca_g, peak, EVE.program.vca_d);
    }

    // Set starting point
    EVE.vca.gain.setTargetAtTime(EVE.program.vca_g, EVE.synth.currentTime, 0.1);

    // Not used at the moment
    if (e.target.dataset.noteValue) {
        e.target.dispatchEvent(EVE.events.press);
        console.log('Go calculate pitch');
    }

    return ampAttack();
};
