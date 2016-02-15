EVE = (function (module) {
    'use strict';

    module.events = {
        updateHarmonicOscillator: new CustomEvent('updateharmonicoscillator', {bubbles: true}),
        updateLfo1: new CustomEvent('updatelfo1', {bubbles: true}),
        updateLfo2: new CustomEvent('updatelfo2', {bubbles: true}),
        updatePerformance: new CustomEvent('updateperformance', {bubbles: true}),
        updateTimbreEg: new CustomEvent('updatetimbreeg', {bubbles: true}),
        updateTimbreEnv: new CustomEvent('updatetimbreenv', {bubbles: true}),
        updateVca: new CustomEvent('updatevca', {bubbles: true})
    };

    return module;
}(EVE));
