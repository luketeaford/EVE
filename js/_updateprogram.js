EVE.update_program = function () {
    'use strict';

    // Harmonic Oscillator
    EVE.update_osc1();
    EVE.update_osc2();
    EVE.update_osc3();
    EVE.update_osc4();
    EVE.update_osc5();
    EVE.update_osc6();
    EVE.update_osc7();
    EVE.update_osc8();

    // VCA
    EVE.update_vca_gain();


    return EVE.update_panel();
};
