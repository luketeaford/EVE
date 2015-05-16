(function collapseModules() {
    'use strict';
    var moduleTitles = document.querySelectorAll('section > h2, .toggle'),
        i;

    function collapseMenu() {
        if (this.parentElement.dataset.state === 'open') {
            this.parentElement.dataset.state = 'closed';
        } else {
            this.parentElement.dataset.state = 'open';
        }
    }

    for (i = 0; i < moduleTitles.length; i += 1) {
        moduleTitles[i].addEventListener('click', collapseMenu);
    }
}());

// Use a module to create keyboard methods, etc.
EVE.keyboard = document.getElementById('keyboard');

EVE.config = {
    harmonics: 8,
    masterFreq: 440,
    octaveShift: 0
};

EVE.program = {
    name: 'INIT',

    // Harmonics (VCAs)
    osc1: 1,
    osc2: 0,
    osc3: 0,
    osc4: 0,
    osc5: 0,
    osc6: 0,
    osc7: 0,
    osc8: 0,

    // Harmonic Envelope (Amounts)
    osc1_eg: 0,
    osc2_eg: 0,
    osc3_eg: 0,
    osc4_eg: 0,
    osc5_eg: 0,
    osc6_eg: 0,
    osc7_eg: 0,
    osc8_eg: 0,

    // Harmonic Envelope
    timbre_a: 0,
    timbre_d: 0,
    timbre_s: 0,
    timbre_r: 0,

    // LFO 1
    lfo1_rate: 4,
    lfo1_type: 'square',
    osc1_lfo: 0,
    osc2_lfo: 0,
    osc3_lfo: 0,
    osc4_lfo: 0,
    osc5_lfo: 0,
    osc6_lfo: 0,
    osc7_lfo: 0,
    osc8_lfo: 0,

    // LFO 2
    lfo2_rate: 3,
    lfo2_type: 'sawtooth',
    lfo2_amp: 0,
    lfo2_pitch: 0,

    // VCA
    vca_a: 0,
    vca_d: 0,
    vca_s: 1,
    vca_r: 0,
    vca_g: 0
};

EVE.now = function () {
    'use strict';
    return EVE.synth.currentTime;
};

EVE.attack = function (x) {
    'use strict';
    console.log(typeof x);
    return EVE.synth.currentTime + x;
};

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

(function buildScope() {
    'use strict';
    var fft = 2048,
        oscope = document.getElementById('scope'),
        ctx = oscope.getContext('2d'),
        lineColor = 'rgb(53, 56, 55)',
        scopeData = new Uint8Array(fft);

    (function draw() {
        var sliceWidth = 300 / fft,// canvas/fft
            x = 0,
            i,
            v,
            y;

        window.requestAnimationFrame(draw);

        ctx.clearRect(0, 0, 300, 150);//canvas size
        ctx.lineWidth = 2;
        ctx.strokeStyle = lineColor;
        ctx.beginPath();
        EVE.oscilloscope.getByteTimeDomainData(scopeData);
        for (i = 0; i < fft; i += 1) {
            v = scopeData[i] / 128;
            y = v * 150 / 2;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            x += sliceWidth;
        }
        ctx.lineTo(300, 150 / 2);//canvas size
        ctx.stroke();
    }());


}());

(function connectSynth() {
    'use strict';

    (function connectHarmonicOscs() {
        var i,
            osc,
            vca;
        for (i = 1; i <= EVE.config.harmonics; i += 1) {
            osc = 'osc' + i;
            vca = osc + '_vca';
            EVE[osc].connect(EVE[vca]);
            EVE[vca].connect(EVE.vca);
        }
    }());

    (function connectLfo1() {
        var i,
            osc,
            lfo,
            vca;
        for (i = 1; i <= EVE.config.harmonics; i += 1) {
            osc = 'osc' + i;
            lfo = osc + '_lfo';
            vca = osc + '_vca';
            EVE.lfo1.connect(EVE[lfo]);
            EVE[lfo].connect(EVE[vca].gain);
        }
    }());

    (function connectLfo2() {
        var i;
        // Oscillators to VCAs
        EVE.lfo2.connect(EVE.lfo2_amp);
        EVE.lfo2.connect(EVE.lfo2_pitch);
        // VCA to amp
        EVE.lfo2_amp.connect(EVE.vca.gain);
        // VCA to pitch
        for (i = 1; i <= EVE.config.harmonics; i += 1) {
            EVE.lfo2_pitch.connect(EVE['osc' + i].frequency);
        }
        EVE.lfo2_pitch.connect(EVE.lfo1.frequency);
    }());

    (function connectVca() {
        EVE.vca.connect(EVE.oscilloscope);
        EVE.vca.connect(EVE.synth.destination);
    }());

}());

//TODO Refactor this
EVE.calculatePitch = function (note) {
    'use strict';
    var oscs = EVE.harmonicOscs,
        i;

    if (EVE.program.lfo_tracking === 'true') {
        oscs.push(EVE.lfo);
    }

    for (i = 0; i < oscs.length; i += 1) {
        oscs[i].detune.setValueAtTime(note, EVE.synth.currentTime);
    }

    return;
};

EVE.gateOn = function gateOn(e) {
    'use strict';
    var peak = EVE.synth.currentTime + parseFloat(EVE.program.vca_a),
        i,
        vca,
        osc,
        env;

    // Harmonic Envelopes
    for (i = 1; i <= EVE.config.harmonics; i += 1) {

        vca = EVE['osc' + i + '_vca'];
        osc = EVE.program['osc' + i];
        env = EVE.program['osc' + i + '_eg'];

        // Timbre starting point
        vca.gain.setTargetAtTime(osc, EVE.now(), 0.1);

        // Timbre attack
        vca.gain.linearRampToValueAtTime(parseFloat(osc) + parseFloat(env), EVE.now() + parseFloat(EVE.program.timbre_a));

        // Timbre decay
        vca.gain.setTargetAtTime(osc + (env * EVE.program.timbre_s), EVE.now() + parseFloat(EVE.program.timbre_a), EVE.program.timbre_d);
    }

    // Set starting point
    EVE.vca.gain.setTargetAtTime(EVE.program.vca_g, EVE.now(), 0.1);

    // Attack
    EVE.vca.gain.linearRampToValueAtTime(1, peak);

    // Decay
    EVE.vca.gain.setTargetAtTime(EVE.program.vca_s + EVE.program.vca_g, peak, EVE.program.vca_d);

    return EVE.calculatePitch(e.target.dataset.noteValue);
};

EVE.keyboard.addEventListener('mousedown', EVE.gateOn);
EVE.keyboard.addEventListener('touchstart', EVE.gateOn);

EVE.gateOff = function gateOff() {
    'use strict';

    var releasePeak = EVE.vca.gain.value,
        timbrePeak,
        vca,
        i;

    // Harmonic Envelopes
    for (i = 1; i <= EVE.config.harmonics; i += 1) {

        vca = EVE['osc' + i + '_vca'];

        // Prevent decay from acting like second attack
        vca.gain.cancelScheduledValues(EVE.now());

        // Set starting point
        timbrePeak = vca.gain.value;
        vca.gain.setValueAtTime(timbrePeak, EVE.now());

        // Release back to starting point
        vca.gain.setTargetAtTime(EVE.program['osc' + i], EVE.now(), EVE.program.timbre_r);
    }

    // Prevent decay from acting like second attack
    EVE.vca.gain.cancelScheduledValues(EVE.synth.currentTime);

    // Set starting point
    EVE.vca.gain.setValueAtTime(releasePeak, EVE.synth.currentTime);

    EVE.vca.gain.setTargetAtTime(EVE.program.vca_g, EVE.synth.currentTime, EVE.program.vca_r);

    return;
};

EVE.keyboard.addEventListener('mouseup', EVE.gateOff);
EVE.keyboard.addEventListener('touchend', EVE.gateOff);
