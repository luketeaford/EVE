EVE.gateOn = function gateOn(e) {
    'use strict';
    var peak = EVE.synth.currentTime + EVE.program.vca_a;

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
