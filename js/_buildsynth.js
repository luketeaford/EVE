EVE.build_synth = function build_synth() {
    'use strict';

    var master = EVE.config.get('master_freq');

    // Master VCA
    EVE.vca = EVE.synth.createGain();
    EVE.vca.connect(EVE.synth.destination);

    // Harmonic Mixer
    EVE.harmonic_mix = EVE.synth.createGain();
    EVE.harmonic_mix.connect(EVE.vca);

    // Harmonic Oscillator
    EVE.osc1 = EVE.synth.createOscillator();
    EVE.osc2 = EVE.synth.createOscillator();
    EVE.osc3 = EVE.synth.createOscillator();
    EVE.osc4 = EVE.synth.createOscillator();
    EVE.osc5 = EVE.synth.createOscillator();
    EVE.osc6 = EVE.synth.createOscillator();
    EVE.osc7 = EVE.synth.createOscillator();
    EVE.osc8 = EVE.synth.createOscillator();

    // Harmonic Oscillator VCAs
    EVE.osc1_vca = EVE.synth.createGain();
    EVE.osc2_vca = EVE.synth.createGain();
    EVE.osc3_vca = EVE.synth.createGain();
    EVE.osc4_vca = EVE.synth.createGain();
    EVE.osc5_vca = EVE.synth.createGain();
    EVE.osc6_vca = EVE.synth.createGain();
    EVE.osc7_vca = EVE.synth.createGain();
    EVE.osc8_vca = EVE.synth.createGain();

    // Connections
    EVE.osc1.connect(EVE.osc1_vca);
    EVE.osc2.connect(EVE.osc2_vca);
    EVE.osc3.connect(EVE.osc3_vca);
    EVE.osc4.connect(EVE.osc4_vca);
    EVE.osc5.connect(EVE.osc5_vca);
    EVE.osc6.connect(EVE.osc6_vca);
    EVE.osc7.connect(EVE.osc7_vca);
    EVE.osc8.connect(EVE.osc8_vca);
    EVE.osc1_vca.connect(EVE.harmonic_mix);
    EVE.osc2_vca.connect(EVE.harmonic_mix);
    EVE.osc3_vca.connect(EVE.harmonic_mix);
    EVE.osc4_vca.connect(EVE.harmonic_mix);
    EVE.osc5_vca.connect(EVE.harmonic_mix);
    EVE.osc6_vca.connect(EVE.harmonic_mix);
    EVE.osc7_vca.connect(EVE.harmonic_mix);
    EVE.osc8_vca.connect(EVE.harmonic_mix);

    // Frequencies
    EVE.osc1.frequency.value = master;
    EVE.osc2.frequency.value = master * 2;
    EVE.osc3.frequency.value = master * 3;
    EVE.osc4.frequency.value = master * 4;
    EVE.osc5.frequency.value = master * 5;
    EVE.osc6.frequency.value = master * 6;
    EVE.osc7.frequency.value = master * 7;
    EVE.osc8.frequency.value = master * 8;

    // Amplitidues
    EVE.osc1_vca.gain.value = EVE.program.get('osc1');
    EVE.osc2_vca.gain.value = EVE.program.get('osc2');
    EVE.osc3_vca.gain.value = EVE.program.get('osc3');
    EVE.osc4_vca.gain.value = EVE.program.get('osc4');
    EVE.osc5_vca.gain.value = EVE.program.get('osc5');
    EVE.osc6_vca.gain.value = EVE.program.get('osc6');
    EVE.osc7_vca.gain.value = EVE.program.get('osc7');
    EVE.osc8_vca.gain.value = EVE.program.get('osc8');

    // LFO
    EVE.lfo = EVE.synth.createOscillator();

    // Tremolo
    EVE.tremolo = EVE.synth.createOscillator();

    // Vibrato
    EVE.vibrato = EVE.synth.createOscillator();

    EVE.build_scope();

    EVE.build_synth = function () {
        return undefined;
    };
};
