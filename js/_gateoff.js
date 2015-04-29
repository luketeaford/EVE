EVE.gateOff = function gateOff() {
    'use strict';

    var releasePeak = EVE.vca.gain.value;

    // Prevent decay from acting like second attack
    EVE.vca.gain.cancelScheduledValues(EVE.synth.currentTime);

    // Set starting point
    EVE.vca.gain.setValueAtTime(releasePeak, EVE.synth.currentTime);

    EVE.vca.gain.setTargetAtTime(EVE.program.vca_g, EVE.synth.currentTime, EVE.program.vca_r);
    return;
};

EVE.keyboard.addEventListener('mouseup', EVE.gateOff);
EVE.keyboard.addEventListener('touchend', EVE.gateOff);
