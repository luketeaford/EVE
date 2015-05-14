EVE.gateOff = function gateOff() {
    'use strict';

    var releasePeak = EVE.vca.gain.value,
        timbrePeak,
        vca,
        i;

    // Harmonic Envelopes
    for (i = 1; i <= EVE.config.harmonics; i += 1) {

        vca = EVE['osc' + i + '_vca'];

        // Prevent decay from acting like second attack
        vca.gain.cancelScheduledValues(EVE.now());

        // Set starting point
        timbrePeak = vca.gain.value;
        vca.gain.setValueAtTime(timbrePeak, EVE.now());

        // Release back to starting point
        vca.gain.setTargetAtTime(EVE.program['osc' + i], EVE.now(), EVE.program.timbre_r);
    }

    // Prevent decay from acting like second attack
    EVE.vca.gain.cancelScheduledValues(EVE.synth.currentTime);

    // Set starting point
    EVE.vca.gain.setValueAtTime(releasePeak, EVE.synth.currentTime);

    EVE.vca.gain.setTargetAtTime(EVE.program.vca_g, EVE.synth.currentTime, EVE.program.vca_r);

    return;
};

EVE.keyboard.addEventListener('mouseup', EVE.gateOff);
EVE.keyboard.addEventListener('touchend', EVE.gateOff);
