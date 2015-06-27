(function buildLfo2() {
    'use strict';
    var i;

    EVE.lfo2 = EVE.synth.createOscillator();
    EVE.lfo2.frequency.value = EVE.program.lfo2_rate;
    EVE.lfo2.type = EVE.program.lfo2_type;

    // VCAs
    EVE.lfo2_amp = EVE.synth.createGain();
    EVE.lfo2_amp.gain.value = EVE.program.lfo2_amp;
    EVE.lfo2_pitch = EVE.synth.createGain();
    EVE.lfo2_pitch.gain.value = EVE.program.lfo2_pitch;

    // Connect LFOs to VCAs
    EVE.lfo2.connect(EVE.lfo2_amp);
    EVE.lfo2.connect(EVE.lfo2_pitch);

    // VCA to amp
    EVE.lfo2_amp.connect(EVE.harmonicOsc.mixer.gain);

    // VCA to pitch
    for (i = 1; i < EVE.config.harmonics; i += 1) {
        EVE.lfo2_pitch.connect(EVE.harmonicOsc['osc' + i].frequency);
    }

    // LFO 2 modulates LFO 1?!
    // Probably in the wrong place because this connection can be toggled
    if (EVE.program.lfo1_track) {
        EVE.lfo2_pitch.connect(EVE.lfo1.frequency);
    }
}());

EVE.lfo2.debug = true;

EVE.lfo2.scope = document.getElementById('lfo2');

EVE.lfo2.update = function (e) {
    'use strict';
    var p;

    if (e.target && e.target.dataset && e.target.dataset.program) {
        p = e.target.dataset.program;
    }

    if (EVE.lfo2.debug && console) {
        console.log(p, EVE.program[p]);
    }

    switch (p) {
    case 'lfo2_amp':
        EVE.lfo2_amp.gain.setValueAtTime(EVE.program.lfo2_amp, EVE.now());
        break;
    case 'lfo2_pitch':
        EVE.lfo2_pitch.gain.setValueAtTime(EVE.program.lfo2_pitch * EVE.config.masterFreq, EVE.now());
        break;
    case 'lfo2_rate':
        EVE.lfo2.frequency.setValueAtTime(EVE.program.lfo2_rate * EVE.harmonicOsc.osc1.frequency.value, EVE.now());
        break;
    case 'lfo2_type':
        EVE.lfo2.type = EVE.program.lfo2_type;
        break;
    default:
        if (EVE.lfo2.debug && console) {
            console.log('Unhandled LFO 2 update change');
        }
    }
};

EVE.lfo2.scope.addEventListener('update_lfo2', EVE.lfo2.update);

EVE.update_lfo2 = new CustomEvent('update_lfo2', {bubbles: true});
