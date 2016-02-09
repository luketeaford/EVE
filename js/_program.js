EVE.program = {
    name: 'INIT',

    // Harmonics (VCAs)
    osc1: 1,
    osc2: 0,
    osc3: 0,
    osc4: 0,
    osc5: 0,
    osc6: 0,
    osc7: 0,
    osc8: 0,

    // Harmonic Envelope (Amounts)
    osc1_eg: 0,
    osc2_eg: 0,
    osc3_eg: 0,
    osc4_eg: 0,
    osc5_eg: 0,
    osc6_eg: 0,
    osc7_eg: 0,
    osc8_eg: 0,

    // Timbre Envelope
    timbre_a: 0,
    timbre_d: 0.125,
    timbre_s: 0,
    timbre_r: 0.125,

    // LFO 1
    lfo1_rate: 1,
    lfo1_range: 20,
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
    lfo2_type: 'sine',
    lfo2_amp: 0,
    lfo2_pitch: 0,
    lfo2_d: 0,
    lfo2_a: 0,
    lfo2_r: 0.0001,
    lfo2_g: 0,

    // VCA
    vca_a: 0,
    vca_d: 0.1,
    vca_s: 0,
    vca_r: 0.1,
    vca_g: 0,

    // Performance
    glide: 0.000001//tolerable maximum = 0.165
};

// TODO This belongs somewhere else
EVE.program.bank = [
    'init',
    'cool-sci-fi-sound',
    'problematic-patch',
    'test-patch'
];

// TODO This belongs somewhere else
EVE.program.number = 0;

// TODO This belongs somewhere else
EVE.program.cycle = function (n) {
    'use strict';
    var i = n && n < 0 ? -1 : 1,
        x = EVE.program.number + i;

    if (x >= 0 && x <= EVE.program.bank.length - 1) {
        EVE.program.number = x;
    }

    console.log('EVE.program.number = ', EVE.program.number);
    console.log('PROGRAM:', EVE.program.bank[EVE.program.number]);

    return i;
};

// TODO Move somewhere else
EVE.program.cycleForward = EVE.program.cycle.bind(null, 1);
EVE.program.cycleBackward = EVE.program.cycle.bind(null, -1);

// TODO These event bindings belong somewhere else
(function bindProgramButtons() {
    'use strict';
    var nextProgram = document.getElementById('nextProgram'),
        prevProgram = document.getElementById('prevProgram');

    nextProgram.addEventListener('click', EVE.program.cycleForward);
    prevProgram.addEventListener('click', EVE.program.cycleBackward);
}());
