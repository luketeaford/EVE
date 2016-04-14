EVE = (function (module) {
    'use strict';
    var debug = true;

    // WHAT IS NEEDED?
    // - a way to easily set up various stages
    // - an interface to complete envelopes
    // - conversion from timing coefficient to time in ms

    // RISE
    module.rise = function (settings) {
        var settings = {
            param: gain,
            target: vca,
            targetValue: 1
        },
            targetParam = module[settings.param][settings.target];

        // Reset
        targetParam.cancelScheduledValues(0);

        // Starting point
        targetParam.setTargetAtTime(module.preset.vca_g, module.currentTime);

        // The actual attack
        targetParam.linearRampToValueAtTime(settings.targetValue, peak);

        return;
    };

    // FALL

    // COULD AN ADSR BE USEFUL (WITHOUT KNOWING ABOUT S)?
    // SAMPLE USAGE
    // (NOT ENTIRELY CLEAR WHERE THIS WOULD BE CALLED)
    // module.adsr(timbre_a, timbre_d, timbre_s, timbre_r);
    // var timbreEnvelope = {
    //     a: timbre_a,
    //     d: timbre_d,
    //     s: timbre_s,
    //     r: timbre_r
    // };
    module.adsr({
        envelope: timbreEnvelope
    });

    module.adsr = function (envelope) {

    };

    // ASR ENVELOPE
    module.asr = function (a, s, r) {

    };

    // AR ENVELOPE
    module.ar = function (a, r) {

    };

    module.attack = function (x) {
        if (debug && console) {
            console.log('Attack function used');
        }

        return module.currentTime + x;
    };

    return module;
}(EVE));
