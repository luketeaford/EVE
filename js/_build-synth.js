(function buildSynth() {
    'use strict';

    // Each build should push its oscillators here to start later
    EVE.oscillators = [];

    (function buildHarmonicOscs() {
        var i,
            osc;
        EVE.harmonicOscs = [];
        for (i = 1; i <= EVE.config.harmonics; i += 1) {
            osc = 'osc' + i;
            EVE[osc] = EVE.synth.createOscillator();
            EVE[osc].frequency.value = EVE.config.masterFreq * i;
            EVE[osc].type = 'sine';
            EVE.harmonicOscs.push(EVE[osc]);
            EVE.oscillators.push(EVE[osc]);
        }
    }());

    (function buildHarmonicVcas() {
        var i,
            osc,
            vca;
        EVE.harmonicVcas = [];
        for (i = 1; i <= EVE.config.harmonics; i += 1) {
            osc = 'osc' + i;
            vca = osc + '_vca';
            EVE[vca] = EVE.synth.createGain();
            EVE[vca].gain.setValueAtTime(EVE.program[osc], EVE.now());
            EVE.harmonicVcas.push(EVE[vca]);
        }
    }());

    (function buildLfo1() {
        EVE.lfo1 = EVE.synth.createOscillator();
        EVE.lfo1.frequency.setValueAtTime(EVE.program.lfo1_rate, EVE.now());
        EVE.lfo1.type = EVE.program.lfo1_type;
        EVE.oscillators.push(EVE.lfo1);
    }());

    (function buildLfo1Vcas() {
        var i,
            osc,
            lfo;
        for (i = 1; i <= EVE.config.harmonics; i += 1) {
            osc = 'osc' + i;
            lfo = osc + '_lfo';
            EVE[lfo] = EVE.synth.createGain();
            EVE[lfo].gain.setValueAtTime(EVE.program[lfo], EVE.now());
        }
    }());

    (function buildLfo2() {
        EVE.lfo2 = EVE.synth.createOscillator();
        EVE.lfo2.frequency.setValueAtTime(EVE.program.lfo2_rate, EVE.now());
        EVE.lfo2.type = EVE.program.lfo2_type;
        EVE.oscillators.push(EVE.lfo2);
    }());

    (function buildLfo2Vcas() {
        EVE.lfo2_amp = EVE.synth.createGain();
        EVE.lfo2_amp.gain.setValueAtTime(EVE.program.lfo2_amp, EVE.now());
        EVE.lfo2_pitch = EVE.synth.createGain();
        EVE.lfo2_pitch.gain.setValueAtTime(EVE.program.lfo2_pitch, EVE.now());
    }());

    (function buildVca() {
        EVE.vca = EVE.synth.createGain();
        EVE.vca.gain.setValueAtTime(EVE.program.vca_g, EVE.now());
    }());

    (function buildOscilloscope() {
        EVE.oscilloscope = EVE.synth.createAnalyser();
    }());

}());
