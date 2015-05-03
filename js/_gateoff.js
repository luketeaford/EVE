// TODO only figure out the complicated brackets once
EVE.gateOff = function gateOff() {
    'use strict';

    var releasePeak = EVE.vca.gain.value,
        timbrePeak,
        i;

    // Harmonic Envelopes
    for (i = 1; i < EVE.config.harmonics + 1; i += 1) {
        // Prevent decay from acting like second attack
        EVE['osc' + i + '_vca'].gain.cancelScheduledValues(EVE.now());

        // Set starting point
        timbrePeak = EVE['osc' + i + '_vca'].gain.value;
        EVE['osc' + i + '_vca'].gain.setValueAtTime(timbrePeak, EVE.now());

        // Release back to starting point
        EVE['osc' + i + '_vca'].gain.setTargetAtTime(EVE.program['osc' + i], EVE.now(), EVE.program.timbre_r);
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
