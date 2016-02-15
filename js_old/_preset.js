EVE.preset = {
    bank: [
        'init',
        'cool-sci-fi-sound',
        'problematic-patch',
        'test-patch'
    ],
    displayName: document.getElementById('display-name'),
    number: 0
};

EVE.preset.cycle = function (n) {
    'use strict';
    var i = n && n < 0 ? -1 : 1,
        x = EVE.preset.number + i;

    if (x >= 0 && x <= EVE.preset.bank.length - 1) {
        EVE.preset.number = x;
    }

    console.log('EVE.preset.number = ', EVE.preset.number);
    console.log('PROGRAM:', EVE.preset.bank[EVE.preset.number]);

    return EVE.preset.load(i);
};

EVE.preset.cycleForward = EVE.preset.cycle.bind(null, 1);
EVE.preset.cycleBackward = EVE.preset.cycle.bind(null, -1);

EVE.update_program = new CustomEvent('update_program', {bubbles: true});

EVE.preset.load = function load(index) {
    'use strict';
    var ajax = new XMLHttpRequest();

    ajax.open('GET', '/presets/cool-sci-fi-sound.json', true);

    ajax.onload = function () {
        var data;

        if (ajax.status >= 200 && ajax.status < 400) {
            data = JSON.parse(ajax.responseText);
            console.log(data);
            EVE.program = data;
            document.dispatchEvent(EVE.update_program);
        } else {
            data = 'Error, dude! Bummer!';
        }
    };

    ajax.send();

    console.log('Loading a preset!', index);
};

EVE.preset.update = function update() {
    'use strict';
    var i,
        osc;// COULD BE GENERALIZED TO P

    // NAME
    EVE.preset.displayName.textContent = EVE.program.name;

    // HARMONIC OSC
    for (i = 1; i <= 8; i += 1) {
        osc = 'osc' + i;// COULD BE GENERALIZED TO P
        EVE.harmonicOsc.inputs[i - 1].value = Math.sqrt(EVE.program[osc]);
    }

    // TIMBRE EG (linear)
    for (i = 1; i <= 8; i += 1) {
        osc = 'osc' + i + '_eg';// COULD BE GENERALIZED TO P
        EVE.timbreEg.inputs[i - 1].value = EVE.program[osc];
    }

    // TIMBRE ENVELOPE
    EVE.timbreEnv.attack.value = Math.sqrt(EVE.program.timbre_a);
    EVE.timbreEnv.decay.value = Math.sqrt(EVE.program.timbre_d);
    EVE.timbreEnv.sustain.value = EVE.program.timbre_s;
    EVE.timbreEnv.release.value = Math.sqrt(EVE.program.timbre_r);

    // VCA ENVELOPE
    EVE.vca.attack.value = Math.sqrt(EVE.program.vca_a);
    EVE.vca.decay.value = Math.sqrt(EVE.program.vca_d);
    EVE.vca.sustain.value = EVE.program.vca_s;
    EVE.vca.release.value = Math.sqrt(EVE.program.vca_r);
    EVE.vca.gain.value = Math.sqrt(EVE.program.vca_g);

    // LFO 1
    switch (EVE.program.lfo1_type) {
    case 'sine':
        EVE.lfo1.sine.checked = true;
        break;
    case 'square':
        EVE.lfo1.square.checked = true;
        break;
    case 'sawtooth':
        EVE.lfo1.saw.checked = true;
        break;
    case 'triangle':
        EVE.lfo1.tri.checked = true;
        break;
    }

    switch (EVE.program.lfo1_range) {
    case 20:
        EVE.lfo1.low.checked = true;
        break;
    case 40:
        EVE.lfo1.mid.checked = true;
        break;
    case 80:
        EVE.lfo1.high.checked = true;
        break;
    case 440:
        EVE.lfo1.track.checked = true;
        break;
    }

    EVE.lfo1.rate.value = Math.sqrt(EVE.program.lfo1_rate);

    for (i = 1; i < EVE.lfo1.oscInputs.length; i += 1) {
        osc = 'osc' + i + '_lfo';// COULD BE GENERALIZED TO P
        EVE.lfo1.oscInputs[i - 1].value = EVE.program[osc];
    }

    // LFO 2
    switch (EVE.program.lfo2_type) {
    case 'sine':
        EVE.lfo2.sine.checked = true;
        break;
    case 'square':
        EVE.lfo2.square.checked = true;
        break;
    case 'sawtooth':
        EVE.lfo2_saw.checked = true;
        break;
    case 'triangle':
        EVE.lfo2_tri.checked = true;
        break;
    }

    EVE.lfo2.rate.value = Math.sqrt(EVE.program.lfo2_rate);

    EVE.lfo2.amp.value = EVE.program.lfo2_amp;
    EVE.lfo2.pitch.value = Math.sqrt(EVE.program.lfo2_pitch);

    EVE.lfo2.delay.value = Math.sqrt(EVE.program.lfo2_d);
    EVE.lfo2.attack.value = Math.sqrt(EVE.program.lfo2_a);
    EVE.lfo2.release.value = Math.sqrt(EVE.program.lfo2_r);
    EVE.lfo2.gain.value = Math.sqrt(EVE.program.lfo2_g);

    // PERFORMANCE
    EVE.performance.glide.value = EVE.program.glide;
};

(function bindProgramButtons() {
    'use strict';
    var nextPreset = document.getElementById('next-preset'),
        prevPreset = document.getElementById('prev-preset');

    nextPreset.addEventListener('click', EVE.preset.cycleForward);
    prevPreset.addEventListener('click', EVE.preset.cycleBackward);
    document.addEventListener('update_program', EVE.preset.update);
}());
