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

    function buildLfo1() {
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

    function buildLfo2() {
        var i;

        // Basics
        EVE.lfo2 = EVE.synth.createOscillator();
        EVE.lfo2.frequency.value = EVE.program.lfo2_rate;
        EVE.lfo2.type = EVE.program.lfo2_type;

        // Create LFO2 VCAS
        EVE.lfo2_amp = EVE.synth.createGain();
        EVE.lfo2_amp.gain.value = EVE.program.lfo2_amp;
        EVE.lfo2_pitch = EVE.synth.createGain();
        EVE.lfo2_pitch.gain.value = EVE.program.lfo2_pitch;

        // Connect LFO2 to its VCAS
        EVE.lfo2.connect(EVE.lfo2_amp);
        EVE.lfo2.connect(EVE.lfo2_pitch);

        // Connect LFO2 VCAs to their destinations
        EVE.lfo2_amp.connect(EVE.vca.gain);
        for (i = 1; i <= EVE.config.harmonics; i += 1) {
            EVE.lfo2_pitch.connect(EVE['osc' + i].frequency);
        }
        EVE.lfo2_pitch.connect(EVE.lfo1.frequency);
    }

    // Master VCA
    EVE.vca = EVE.synth.createGain();
    EVE.vca.gain.setValueAtTime(0, EVE.now());
    EVE.vca.connect(EVE.synth.destination);

    // Harmonic Oscillator
    buildHarmonicOsc();

    // LFO
    buildLfo1();
    buildLfo2();

    // Prevent twice
    EVE.buildSynth = function buildSynth() {
        console.warn('Synth already built');
        return 'Synth already built';
    };

    return true;
};
