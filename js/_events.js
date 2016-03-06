EVE = (function (module) {
    'use strict';

    module.events = {
        gateoff: new CustomEvent('gateoff', {
            bubbles: true
        }),

        gateon: new CustomEvent('gateon', {
            bubbles: true
        }),

        updateharmonicoscillator: new CustomEvent('updateharmonicoscillator', {
            bubbles: true
        }),

        updatelfo1: new CustomEvent('updatelfo1', {
            bubbles: true
        }),

        updatelfo2: new CustomEvent('updatelfo2', {
            bubbles: true
        }),

        updateperformance: new CustomEvent('updateperformance', {
            bubbles: true
        }),

        loadpreset: new CustomEvent('loadpreset', {
            bubbles: true
        }),

        updatetimbreeg: new CustomEvent('updatetimbreeg', {
            bubbles: true
        }),

        updatetimbreenv: new CustomEvent('updatetimbreenv', {
            bubbles: true
        }),

        updatevca: new CustomEvent('updatevca', {
            bubbles: true
        })
    };

    return module;
}(EVE));
