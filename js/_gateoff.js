EVE.gateOff = function gateOff() {
    'use strict';

    function ampRelease() {
        var releasePeak = EVE.vca.gain.value;

        // Set starting point
        EVE.vca.gain.setValueAtTime(releasePeak, EVE.synth.currentTime);
        return EVE.vca.gain.setTargetAtTime(EVE.program.vca_g, EVE.synth.currentTime, EVE.program.vca_r);
    }

    // Prevent decay from acting like second attack
    EVE.vca.gain.cancelScheduledValues(EVE.synth.currentTime);

    return ampRelease();
};
