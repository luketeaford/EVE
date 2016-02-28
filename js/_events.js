EVE = (function (module) {
    'use strict';

    // If events were lowercased, that would solve the problem, too
    module.events = {
        gateOff: new CustomEvent('gateoff', {bubbles: true}),
        gateOn: new CustomEvent('gateon', {bubbles: true}),
        updateHarmonicOscillator: new CustomEvent('updateharmonicoscillator', {bubbles: true}),
        updateLfo1: new CustomEvent('updatelfo1', {bubbles: true}),
        updateLfo2: new CustomEvent('updatelfo2', {bubbles: true}),
        updatePerformance: new CustomEvent('updateperformance', {bubbles: true}),
        updatePreset: new CustomEvent('updatepreset', {bubbles: true}),
        updateTimbreEg: new CustomEvent('updatetimbreeg', {bubbles: true}),
        updateTimbreEnv: new CustomEvent('updatetimbreenv', {bubbles: true}),
        updateVca: new CustomEvent('updatevca', {bubbles: true})
    };

    return module;
}(EVE));
