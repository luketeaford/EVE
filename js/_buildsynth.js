EVE.buildSynth = function buildSynth() {
    'use strict';
    EVE.harmonicOscs = [];
    EVE.harmonicVcas = [];

    function buildHarmonicOsc(x) {
        var i,
            osc,
            vca;

        for (i = 1; i < (x + 1); i += 1) {
            osc = 'osc' + i;
            vca = osc + '_vca';

            EVE[vca] = EVE.synth.createGain();
            EVE[vca].gain.setValueAtTime(EVE.program[osc], EVE.now());
            EVE[vca].connect(EVE.vca);

            EVE[osc] = EVE.synth.createOscillator();
            EVE[osc].type = 'sine';
            EVE[osc].frequency.value = EVE.config.master_freq * i;
            EVE[osc].connect(EVE[vca]);

            EVE.harmonicOscs.push(EVE[osc]);
            EVE.harmonicVcas.push(EVE[vca]);
        }

    }

    function buildLfo() {
        var i;

        EVE.lfo = EVE.synth.createOscillator();
        EVE.lfo.frequency.value = EVE.program.lfo_rate;
        EVE.lfo.type = EVE.program.lfo_type;

        for (i = 1; i <= EVE.config.harmonics; i += 1) {
            EVE['lfo' + i] = EVE.synth.createGain();
            EVE['lfo' + i].gain.value = EVE.program['lfo' + i];
            EVE.lfo.connect(EVE['lfo' + i]);
            EVE['lfo' + i].connect(EVE['osc' + i + '_vca'].gain);
        }
    }

    // Master VCA
    EVE.vca = EVE.synth.createGain();
    EVE.vca.gain.setValueAtTime(0, EVE.now());
    EVE.vca.connect(EVE.synth.destination);

    // Harmonic Oscillator
    // TODO why pass this in? Would be nicer inside
    buildHarmonicOsc(EVE.config.harmonics);

    // LFO
    buildLfo();

    // Prevent twice
    EVE.buildSynth = function buildSynth() {
        console.warn('Synth already built');
        return 'Synth already built';
    };

    return true;
};
