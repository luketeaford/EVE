EVE.gateOn = function gateOn() {
    'use strict';
    var env,
        i,
        osc,
        peak = EVE.now() + EVE.program.vca_a * EVE.config.eg_max + EVE.config.eg_min,
        timbrePeak = EVE.now() + EVE.program.timbre_a * EVE.config.eg_max + EVE.config.eg_min,
        vca;

    EVE.keyboard.keyDown = true;//OLD WAY

    // LFO 2 envelope
    // LFO 2 starting point
    EVE.lfo2_vca.gain.setTargetAtTime(EVE.program.lfo2_g, EVE.now(), 0.1);

    // LFO 2 attack (with delay)
    EVE.lfo2_vca.gain.setTargetAtTime(1, EVE.now() + EVE.program.lfo2_d * EVE.config.eg_max, EVE.program.lfo2_a * EVE.config.eg_max + EVE.config.eg_min);


    // Timbre envelope
    for (i = 1; i <= 8; i += 1) {

        env = EVE.program['osc' + i + '_eg'];
        osc = EVE.program['osc' + i];
        vca = EVE.harmonicOsc['osc' + i].vca;

        // Timbre starting point
        vca.gain.setTargetAtTime(osc, EVE.now(), 0.1);

        // Timbre attack
        vca.gain.linearRampToValueAtTime(osc + env, timbrePeak);

        // Timbre decay
        vca.gain.setTargetAtTime(osc + (env * EVE.program.timbre_s), timbrePeak, EVE.program.timbre_d * EVE.config.eg_max);
    }

    // VCA starting point
    EVE.vca.gain.setTargetAtTime(EVE.program.vca_g, EVE.now(), 0.1);

    // VCA attack
    EVE.vca.gain.linearRampToValueAtTime(1, peak);

    // VCA decay
    EVE.vca.gain.setTargetAtTime(EVE.program.vca_s + EVE.program.vca_g, peak, EVE.program.vca_d * EVE.config.eg_max);

    return;
};

EVE.keyboard.scope.addEventListener('mousedown', EVE.gateOn);
EVE.keyboard.scope.addEventListener('touchstart', EVE.gateOn);
