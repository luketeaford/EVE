EVE.buildSynth = function buildSynth() {
    'use strict';
    EVE.harmonicOscs = [];
    EVE.harmonicVcas = [];

    function buildHarmonicOsc() {
        var i,
            osc,
            vca;

        for (i = 1; i <= EVE.config.harmonics; i += 1) {
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

        EVE.lfo1 = EVE.synth.createOscillator();
        EVE.lfo1.frequency.value = EVE.program.lfo1_rate;
        EVE.lfo1.type = EVE.program.lfo1_type;

        for (i = 1; i <= EVE.config.harmonics; i += 1) {
            EVE['osc' + i + '_lfo'] = EVE.synth.createGain();
            EVE['osc' + i + '_lfo'].gain.value = EVE.program['osc' + i + '_lfo'];
            EVE.lfo1.connect(EVE['osc' + i + '_lfo']);
            EVE['osc' + i + '_lfo'].connect(EVE['osc' + i + '_vca'].gain);
        }
    }

    // Master VCA
    EVE.vca = EVE.synth.createGain();
    EVE.vca.gain.setValueAtTime(0, EVE.now());
    EVE.vca.connect(EVE.synth.destination);

    // Harmonic Oscillator
    buildHarmonicOsc();

    // LFO
    buildLfo();

    // Prevent twice
    EVE.buildSynth = function buildSynth() {
        console.warn('Synth already built');
        return 'Synth already built';
    };

    return true;
};
