(function buildLfo1() {
    'use strict';
    var i,
        lfo,
        osc;

    // The LFO itself
    EVE.lfo1 = EVE.synth.createOscillator();
    EVE.lfo1.frequency.value = EVE.program.lfo1_rate;
    EVE.lfo1.type = EVE.program.lfo1_type;

    // LFO 1 VCAs
    for (i = 1; i <= EVE.config.harmonics; i += 1) {
        osc = 'osc' + i;
        lfo = osc + '_lfo';
        EVE[lfo] = EVE.synth.createGain();
        EVE[lfo].gain.value = EVE.program[lfo];
        // Connect LFO 1 to each LFO VCA
        EVE.lfo1.connect(EVE[lfo]);
        // Connect to harmonic oscillator VCAs
        EVE[lfo].connect(EVE.harmonicOsc[osc].vca.gain);
    }

}());

EVE.lfo1.debug = true;

EVE.lfo1.scope = document.getElementById('lfo1');

EVE.lfo1.update = function (e) {
    'use strict';
    var p;

    if (e.target && e.target.dataset && e.target.dataset.program) {
        p = e.target.dataset.program;
    }

    if (EVE.lfo1.debug && console) {
        console.log(p, EVE.program[p]);
    }

    switch (p) {
    case 'lfo1_type':
        EVE.lfo1.type = EVE.program.lfo1_type;
        break;
    case 'lfo1_rate':
        EVE.lfo1.frequency.setValueAtTime(EVE.program.lfo1_rate * EVE.harmonicOsc.osc1.frequency.value, EVE.now());
        break;
    case 'osc1_lfo':
    case 'osc2_lfo':
    case 'osc3_lfo':
    case 'osc4_lfo':
    case 'osc5_lfo':
    case 'osc6_lfo':
    case 'osc7_lfo':
    case 'osc8_lfo':
        EVE[p].gain.setValueAtTime(EVE.program[p], EVE.now());
        break;
    default:
        if (EVE.lfo1.debug && console) {
            console.log('Unhandled LFO 1 update change');
        }
    }

};

EVE.lfo1.scope.addEventListener('update_lfo1', EVE.lfo1.update);

EVE.update_lfo1 = new CustomEvent('update_lfo1', {bubbles: true});
