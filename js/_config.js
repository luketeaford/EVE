EVE = (function config(module) {
    'use strict';

    module.config = {
        egMax: 2.125,
        egMin: 0.025,
        fineTune: 0,
        fineTuneRange: 51,
        glideMax: 0.165,
        glideMin: 0.0001,
        lfo2DelayMax: 2,
        lfo2AmpMaxDepth: 1.28,
        lfo2PitchMaxDepth: 3520,
        lfo2RateMax: 139,
        masterFreq: 440,
        pitchBendRange: 1200,
        pitchBendSlew: 0.0001,
        ribbonRange: 2400,
        ribbonSlew: 0.01,
        trackedOscs: []
    };

    return module;
}(EVE));
