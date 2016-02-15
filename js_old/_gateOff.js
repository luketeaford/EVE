// TODO Support 0 release times
EVE.gateOff = function gateOff() {
    'use strict';

    var i,
        lfo2Peak = EVE.lfo2_vca.gain.value,
        vcaPeak = EVE.vca.gain.value,
        timbrePeak,
        vca;

    EVE.keyboard.keyDown = false;

    // LFO 2 envelope
    // Prevent decay from acting like second attack
    EVE.lfo2_vca.gain.cancelScheduledValues(EVE.now());

    // LFO 2 starting point
    EVE.lfo2_vca.gain.setValueAtTime(lfo2Peak, EVE.now());

    // LFO 2 release
    EVE.lfo2_vca.gain.setTargetAtTime(EVE.program.lfo2_g, EVE.now(), EVE.program.lfo2_r);

    // Timbre envelope
    for (i = 1; i <= 8; i += 1) {

        vca = EVE.harmonicOsc['osc' + i].vca;

        // Prevent decay from acting like second attack
        vca.gain.cancelScheduledValues(EVE.now());

        // Timbre starting point
        timbrePeak = vca.gain.value;
        vca.gain.setValueAtTime(timbrePeak, EVE.now());

        // Timbre release
        vca.gain.setTargetAtTime(EVE.program['osc' + i], EVE.now(), EVE.program.timbre_r);
    }

    // Prevent decay from acting like second attack
    EVE.vca.gain.cancelScheduledValues(EVE.synth.currentTime);

    // VCA starting point
    EVE.vca.gain.setValueAtTime(vcaPeak, EVE.synth.currentTime);

    // VCA release
    EVE.vca.gain.setTargetAtTime(EVE.program.vca_g, EVE.synth.currentTime, EVE.program.vca_r * EVE.config.egMax + EVE.config.egMin);

    return;
};

EVE.keyboard.scope.addEventListener('mouseup', EVE.gateOff);
EVE.keyboard.scope.addEventListener('touchend', EVE.gateOff);
