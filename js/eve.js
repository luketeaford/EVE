// EVE Web Audio Synthesizer
// Copyright 2015 Luke Teaford
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
// luketeaford@gmail.com
// 153 Illinois Avenue, Dayton OH 45410

var Config = Backbone.Model.extend({
        initialize: function () {
            'use strict';
            console.log('config created');
        }
    }),

    Program = Backbone.Model.extend({
        initialize: function () {
            'use strict';
            console.log('program created');
        }
    });

window.AudioContext = window.AudioContext || window.webkitAudioContext;

var EVE = {
    synth: new AudioContext(),
    playing: [],

    config: new Config({
        master_freq: 444,
        octave_shift: 0
    }),

    program: new Program({
        name: 'INITIALIZE',

        osc1: 1,
        osc2: 0,
        osc3: 0,
        osc4: 0,
        osc5: 0,
        osc6: 0,
        osc7: 0,
        osc8: 0,

        vca_a: 0.01,
        vca_d: 0.4,
        vca_s: 1,
        vca_r: 0.4,
        vca_g: 0,

        lfo_amt: 0,
        lfo_rate: 0,

        trem_amt: 0,
        trem_rate: 0,

        vib_amt: 0,
        vib_rate: 0

    })

};

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

    // Start drawing
    function draw() {
        var sliceWidth = 300 / 2048,
            x = 0,
            i,
            v,
            y;

        window.requestAnimationFrame(draw);

        EVE.ctx.clearRect(0, 0, 300, 150);
        EVE.ctx.lineWidth = 2;
        EVE.ctx.strokeStyle = 'rgb(242, 219, 33)';
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

    EVE.build_scope = function build_scope() {
        return undefined;
    };
};

EVE.start_synth = function () {
    'use strict';

    // Harmonic Oscillators
    EVE.osc1.start(0);
    EVE.osc2.start(0);
    EVE.osc3.start(0);
    EVE.osc4.start(0);
    EVE.osc5.start(0);
    EVE.osc6.start(0);
    EVE.osc7.start(0);
    EVE.osc8.start(0);

    // LFOs
    EVE.lfo.start(0);
    EVE.tremolo.start(0);
    EVE.vibrato.start(0);

    // Prevent any future events from calling start_synth
    $('#keyboard').off('mousedown keydown touchstart', 'button', EVE.start_synth);

    EVE.start_synth = function () {
        return undefined;
    };
};

EVE.gate_on = function (e) {
    'use strict';
    var n,
        note_value,
        i = 0;

    // This could be clearer by testing for EVE.legato or EVE.staccato
    if (EVE.playing.length === 0 || EVE.legato === false) {
        EVE.amp_env_on();
    }

    if (this.getAttribute) {
        // Notes coming from qwerty or touch
        // Not the best way to use data attributes
        note_value = parseFloat(this.getAttribute('data-note-value'));
        // might be wrong
        n = ((note_value + 900) / 100) + 60;
    } else {
        // Notes coming from MIDI
        n = e.data[i];
        note_value = 100 * (n % 12) - 900;
    }

    // Prevent duplicate notes
    if (EVE.playing.indexOf(n) === -1) {
        EVE.playing.push(n);
    }

    EVE.set_pitch(note_value);

};

EVE.amp_env_on = function () {
    'use strict';
    // Set starting point - Exponential fade out
    EVE.vca.gain.setTargetAtTime(EVE.program.get('vca_g'), EVE.synth.currentTime, 0.05);
    EVE.amp_attack();
};

EVE.amp_attack = function () {
    'use strict';
    var vca_end_of_attack = EVE.synth.currentTime + EVE.program.get('vca_a');

    // Attack
    EVE.vca.gain.linearRampToValueAtTime(1, vca_end_of_attack);

    // Decay
    EVE.vca.gain.setTargetAtTime(EVE.program.get('vca_s') + EVE.program.get('vca_g'), vca_end_of_attack, EVE.program.get('vca_d'));
};

EVE.gate_off = function () {
    'use strict';
    EVE.playing.pop();// Make sure this always makes sense
    if (EVE.playing.length) {
        var n = EVE.playing.sort()[EVE.playing.length - 1],
            note_value = 100 * (n % 12) - 900;
        EVE.set_pitch(note_value);
    } else {
        EVE.amp_env_off();
    }
};

EVE.amp_env_off = function () {
    'use strict';
    // Prevent decay from acting like second attack
    EVE.vca.gain.cancelScheduledValues(EVE.synth.currentTime);
    EVE.amp_release();
};

EVE.amp_release = function () {
    'use strict';
    var vca_release_peak = EVE.vca.gain.value;

    // Set starting point
    EVE.vca.gain.setValueAtTime(vca_release_peak, EVE.synth.currentTime);

    // Release
    EVE.vca.gain.setTargetAtTime(EVE.program.get('vca_g'), EVE.synth.currentTime, EVE.program.get('vca_r'));
};

EVE.set_pitch = function (note_value) {
    'use strict';
    var pitch = EVE.config.get('octave_shift') * 1200 + note_value,
        i,
        oscx;

    // No glide
    for (i = 0; i < 8; i += 1) {
        oscx = 'osc' + (1 + i);
        EVE[oscx].detune.setValueAtTime(pitch, EVE.synth.currentTime);
    }

};

EVE.toggle_module = function toggle_module() {
    'use strict';
    this.dataset.state = this.dataset.state === 'closed' ? 'open' : 'closed';
    return this;
};

EVE.slider = {
    grab: function () {
        'use strict';
        var config = {
            program: this.getAttribute('data-program'),
            update: this.getAttribute('data-update')
        };
        return $(this).on('mousemove touchmove', config, EVE.store_program)
                      .on('mouseup touchend', EVE.slider.release);
    },

    release: function () {
        'use strict';
        return $(this).unbind('mousemove touchmove');
    }
};

// These are all essentially the same
EVE.update_osc1 = function () {
    'use strict';
    return EVE.osc1_vca.gain.setValueAtTime(EVE.program.osc1 * EVE.program.osc1, EVE.synth.currentTime);
};

EVE.update_osc2 = function () {
    'use strict';
    return EVE.osc2_vca.gain.setValueAtTime(EVE.program.osc2 * EVE.program.osc2, EVE.synth.currentTime);
};

EVE.update_osc3 = function () {
    'use strict';
    return EVE.osc3_vca.gain.setValueAtTime(EVE.program.osc3 * EVE.program.osc3, EVE.synth.currentTime);
};

EVE.update_osc4 = function () {
    'use strict';
    return EVE.osc4_vca.gain.setValueAtTime(EVE.program.osc4 * EVE.program.osc4, EVE.synth.currentTime);
};

EVE.update_osc5 = function () {
    'use strict';
    return EVE.osc5_vca.gain.setValueAtTime(EVE.program.osc5 * EVE.program.osc5, EVE.synth.currentTime);
};

EVE.update_osc6 = function () {
    'use strict';
    return EVE.osc6_vca.gain.setValueAtTime(EVE.program.osc6 * EVE.program.osc6, EVE.synth.currentTime);
};

EVE.update_osc7 = function () {
    'use strict';
    return EVE.osc7_vca.gain.setValueAtTime(EVE.program.osc7 * EVE.program.osc7, EVE.synth.currentTime);
};

EVE.update_osc8 = function () {
    'use strict';
    return EVE.osc8_vca.gain.setValueAtTime(EVE.program.osc8 * EVE.program.osc8, EVE.synth.currentTime);
};

EVE.store_program = function (e) {
    'use strict';

    EVE.program[e.data.program] = parseFloat(e.currentTarget.value);

    if (EVE[e.data.update]) {
        return EVE[e.data.update]();
    }

    return;
};

$(document).ready(function () {
    'use strict';
    EVE.build_synth();

    // Module controls
    $('section').on('click', 'h2', EVE.toggle_module);

    // Slider controls
    $('#harmonics').on('mousedown touchstart', 'input', EVE.slider.grab);

    $('#keyboard')
        // Start oscillators
        .one('mousedown keydown touchstart', 'button', EVE.start_synth)
        // Synth keys
        .on('mousedown touchstart', 'button', EVE.gate_on)
        .on('mouseup touchend', 'button', EVE.gate_off);
});
