// Currently does not have a nice debug like the other things...
EVE.gateOff = function gateOff() {
    'use strict';

    var i,
        lfo2Peak = EVE.lfo2_vca.gain.value,
        releasePeak = EVE.vca.gain.value,//TODO Rename vcaPeak
        timbrePeak,
        vca;

    // LFO 2 envelope
    // Prevent decay from acting like second attack
    EVE.lfo2_vca.gain.cancelScheduledValues(EVE.synth.currentTime);

    // LFO 2 starting point
    EVE.lfo2_vca.gain.setValueAtTime(lfo2Peak, EVE.synth.currentTime);

    // LFO 2 release
    EVE.lfo2_vca.gain.setTargetAtTime(EVE.program.lfo2_g, EVE.synth.currentTime, EVE.program.lfo2_r);

    // Harmonic Envelopes
    for (i = 1; i <= 8; i += 1) {

        vca = EVE.harmonicOsc['osc' + i].vca;

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

EVE.keyboard.scope.addEventListener('mouseup', EVE.gateOff);
EVE.keyboard.scope.addEventListener('touchend', EVE.gateOff);
