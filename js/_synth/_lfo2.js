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
    EVE.lfo2_vca = EVE.synth.createGain();
    EVE.lfo2_vca.gain.value = 0;

    // Connect LFO to its VCA
    EVE.lfo2.connect(EVE.lfo2_vca);

    // Connect LFO VCA to its pitch and amp VCAs
    EVE.lfo2_vca.connect(EVE.lfo2_amp);
    EVE.lfo2_vca.connect(EVE.lfo2_pitch);

    // VCA to amp
    EVE.lfo2_amp.connect(EVE.harmonicOsc.mixer.gain);

    // VCA to pitch
    for (i = 1; i <= 8; i += 1) {
        EVE.lfo2_pitch.connect(EVE.harmonicOsc['osc' + i].frequency);
    }

    // TODO Figure out what I was thinking when I typed the following:
    // LFO 2 modulates LFO 1?!
    // Probably in the wrong place because this connection can be toggled
    if (EVE.program.lfo1_track) {
        EVE.lfo2_pitch.connect(EVE.lfo1.frequency);
    }
}());

EVE.lfo2.debug = true;
EVE.lfo2.max = 40;// TODO 139 is a better number here
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
    case 'lfo2_g':
        EVE.lfo2_vca.gain.setValueAtTime(EVE.program.lfo2_g, EVE.now());
        break;
    case 'lfo2_pitch':
        // TODO: Why multiply program.lfo2_pitch by some weird number?
        // Because I want to keep the program 0-1
        // Move 139 into EVE.config somewhere
        EVE.lfo2_pitch.gain.setValueAtTime(EVE.program.lfo2_pitch * 139, EVE.now());
        break;
    case 'lfo2_rate':
        EVE.lfo2.frequency.setValueAtTime(EVE.program.lfo2_rate * EVE.lfo2.max, EVE.now());
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
