EVE.build_synth = function build_synth() {
    'use strict';

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
    EVE.osc1.frequency.value = EVE.master_freq;
    EVE.osc2.frequency.value = EVE.master_freq * 2;
    EVE.osc3.frequency.value = EVE.master_freq * 3;
    EVE.osc4.frequency.value = EVE.master_freq * 4;
    EVE.osc5.frequency.value = EVE.master_freq * 5;
    EVE.osc6.frequency.value = EVE.master_freq * 6;
    EVE.osc7.frequency.value = EVE.master_freq * 7;
    EVE.osc8.frequency.value = EVE.master_freq * 8;

    // Amplitidues (Only useful temporarily)
    EVE.osc1_vca.gain.value = 0;
    EVE.osc2_vca.gain.value = 0;
    EVE.osc3_vca.gain.value = 0;
    EVE.osc4_vca.gain.value = 0;
    EVE.osc5_vca.gain.value = 0;
    EVE.osc6_vca.gain.value = 0;
    EVE.osc7_vca.gain.value = 0;
    EVE.osc8_vca.gain.value = 0;

    // LFO
    EVE.lfo = EVE.synth.createOscillator();

    // Tremolo
    EVE.tremolo = EVE.synth.createOscillator();

    // Vibrato
    EVE.vibrato = EVE.synth.createOscillator();

    // Callbacks
    EVE.build_scope();

    EVE.build_synth = function () {
        return undefined;
    };
};

EVE.build_scope = function build_scope() {
    'use strict';

    // Canvas parts
    EVE.oscope = document.getElementById('scope');
    EVE.ctx = EVE.oscope.getContext('2d');

    // Oscilloscope
    EVE.oscilloscope = EVE.synth.createAnalyser();
    EVE.oscilloscope.fftSize = 2048;
    EVE.vca.connect(EVE.oscilloscope);

    EVE.scope_data = new Uint8Array(2048);

    // Actually start drawing shit
    function draw() {
        var sliceWidth = 300 / 2048,
            x = 0,
            i,
            v,
            y;

        window.requestAnimationFrame(draw);

        EVE.ctx.clearRect(0, 0, 300, 150);
        EVE.ctx.lineWidth = 2;
        EVE.ctx.strokeStyle = 'rgb(255, 255, 0)';
        EVE.ctx.beginPath();
        EVE.oscilloscope.getByteTimeDomainData(EVE.scope_data);
        for (i = 0; i < 2048; i += 1) {
            v = EVE.scope_data[i] / 128;
            y = v * 150 / 2;

            if (i === 0) {
                EVE.ctx.moveTo(x, y);
            } else {
                EVE.ctx.lineTo(x, y);
            }
            x += sliceWidth;
        }
        EVE.ctx.lineTo(300, 150 / 2);
        EVE.ctx.stroke();
    }

    draw();
};
