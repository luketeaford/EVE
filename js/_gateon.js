EVE.gateOn = function gateOn(e) {
    'use strict';
    if (e.target.dataset.noteValue) {
        console.log(e.target.dataset.noteValue);
        // Attack
        EVE.vca.gain.linearRampToValueAtTime(1, EVE.attack(EVE.program.vca_a));

        // Decay
        //EVE.vca.gain.setTargetAtTime(EVE.program.vca_s + EVE.program.vca_g, vca_end_of_attack, EVE.program.vca_d);

        e.target.dispatchEvent(EVE.press);
    }
};
