// The preset object contains the changing parameters. The entire preset object
// can be changed dynamically, so it must not contain anything else.
EVE = (function (module) {
    'use strict';
    module.preset = {
        name: 'INIT',

        // Harmonic oscillator VCAs
        osc1: 1,
        osc2: 0,
        osc3: 0,
        osc4: 0,
        osc5: 0,
        osc6: 0,
        osc7: 0,
        osc8: 0,

        // Harmonic oscillator envelope amounts
        osc1_eg: 0,
        osc2_eg: 0,
        osc3_eg: 0,
        osc4_eg: 0,
        osc5_eg: 0,
        osc6_eg: 0,
        osc7_eg: 0,
        osc8_eg: 0,

        // Timbre envelope
        timbre_a: 0,
        timbre_d: 0.125,
        timbre_s: 0.5,
        timbre_r: 0.125,

        // LFO 1
        lfo1_rate: 1,
        lfo1_range: 'low',
        lfo1_type: 'sine',
        osc1_lfo: 0,
        osc2_lfo: 0,
        osc3_lfo: 0,
        osc4_lfo: 0,
        osc5_lfo: 0,
        osc6_lfo: 0,
        osc7_lfo: 0,
        osc8_lfo: 0,

        // LFO 2
        lfo2_rate: 3,
        lfo2_polarity: 1,
        lfo2_type: 'sine',
        lfo2_amp: 0,
        lfo2_pitch: 0,
        lfo2_delay: 0,
        lfo2_a: 0,
        lfo2_r: 0.0001,
        lfo2_g: 0,

        // VCA
        vca_a: 0,
        vca_d: 0.1,
        vca_s: 0.5,
        vca_r: 0.1,
        vca_g: 0,

        // Performance
        glide: 0.00001

    };

    module.defaultPreset = module.preset;

    return module;
}(EVE));
