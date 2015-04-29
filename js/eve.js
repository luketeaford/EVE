window.AudioContext = window.AudioContext || window.webkitAudioContext;

var EVE = {

    synth: new AudioContext(),

    config: {
        harmonics: 8,
        master_freq: 440,
        octave_shift: 0
    },

    program: {
        name: 'INITIALIZE',

        osc1: 1,
        osc2: 0,
        osc3: 0,
        osc4: 0,
        osc5: 0,
        osc6: 0,
        osc7: 0,
        osc8: 0,

        vca_a: 0.1,
        vca_d: 0.1,
        vca_s: 0.15,
        vca_r: 0.1,
        vca_g: 0
    },

    // Experimental time savers
    now: function now() {
        'use strict';
        return EVE.synth.currentTime;
    },

    attack: function attack(x) {
        'use strict';
        return EVE.synth.currentTime + x;
    },

    decay: function decay() {
        'use strict';
        return;
    },

    sustain: function sustain() {
        'use strict';
        return;
    },

    release: function release() {
        'use strict';
        return;
    }

};

function navTemplate() {
    'use strict';
    return false;
}

EVE.events = {
    update: new CustomEvent('update', {
        bubbles: true
    }),
    navigate: new CustomEvent('navigate', {
        // Only here to demonstrate how to include arbitrary data
        detail: {
            place: window.location
        },
        bubbles: true
    })
};

EVE.buildSynth = function buildSynth() {
    'use strict';
    EVE.harmonicOscs = [];
    EVE.harmonicVcas = [];

    function buildHarmonicOsc(x) {
        var i,
            j,
            osc,
            vca;

        for (i = 0; i < x; i += 1) {
            j = i + 1;
            osc = 'osc' + j;
            vca = osc + '_vca';

            EVE[vca] = EVE.synth.createGain();
            EVE[vca].gain.setValueAtTime(EVE.program[osc], EVE.now());
            EVE[vca].connect(EVE.vca);

            EVE[osc] = EVE.synth.createOscillator();
            EVE[osc].type = 'sine';
            EVE[osc].frequency.value = EVE.config.master_freq * j;
            EVE[osc].connect(EVE[vca]);

            EVE.harmonicOscs.push(EVE[osc]);
            EVE.harmonicVcas.push(EVE[vca]);
        }

    }

    // Master VCA
    EVE.vca = EVE.synth.createGain();
    EVE.vca.gain.setValueAtTime(0, EVE.now());
    EVE.vca.connect(EVE.synth.destination);

    // Harmonic Oscillator
    buildHarmonicOsc(EVE.config.harmonics);

    // Prevent twice
    EVE.buildSynth = function buildSynth() {
        console.warn('Synth already built');
        return 'Synth already built';
    };

    return true;
};

EVE.buildScope = function buildScope() {
    'use strict';
    var fft = 2048,
        oscope = document.getElementById('scope'),
        ctx = oscope.getContext('2d'),
        scopeData = new Uint8Array(fft);

    // TODO Could go in buildSynth()...
    EVE.oscilloscope = EVE.synth.createAnalyser();
    EVE.vca.connect(EVE.oscilloscope);

    // Start drawing
    function draw() {
        var sliceWidth = 300 / fft,// canvas/fft
            x = 0,
            i,
            v,
            y;

        window.requestAnimationFrame(draw);

        ctx.clearRect(0, 0, 300, 150);//canvas size
        ctx.lineWidth = 2;
        //TODO Get actual gold color
        ctx.strokeStyle = 'rgb(255, 255, 0)';
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
    }

    draw();

    EVE.buildScope = function buildScope() {
        console.warn('buildScope already called');
        return 'Scope already built';
    };

};

EVE.startSynth = function startSynth() {
    'use strict';
    var i;
    for (i = 0; i < EVE.config.harmonics; i += 1) {
        EVE.harmonicOscs[i].start(0);
    }

    document.removeEventListener('click', startSynth);
    document.removeEventListener('dblclick', startSynth);
    document.removeEventListener('keydown', startSynth);
    document.removeEventListener('touchstart', startSynth);
    document.removeEventListener('wheel', startSynth);

    EVE.startSynth = function startSynth() {
        console.warn('Synth can only be started once');
        return true;
    };
};

document.addEventListener('click', EVE.startSynth);
document.addEventListener('dblclick', EVE.startSynth);
document.addEventListener('keydown', EVE.startSynth);
document.addEventListener('touchstart', EVE.startSynth);
document.addEventListener('wheel', EVE.startSynth);

EVE.gateOn = function gateOn(e) {
    'use strict';
    var peak = EVE.synth.currentTime + EVE.program.vca_a;

    // Set starting point
    EVE.vca.gain.setTargetAtTime(EVE.program.vca_g, EVE.synth.currentTime, 0.1);

    // Attack
    EVE.vca.gain.linearRampToValueAtTime(1, peak);

    // Decay
    EVE.vca.gain.setTargetAtTime(EVE.program.vca_s + EVE.program.vca_g, peak, EVE.program.vca_d);

    return EVE.calculatePitch(e.target.dataset.noteValue);
};

EVE.gateOff = function gateOff() {
    'use strict';

    var releasePeak = EVE.vca.gain.value;

    // Prevent decay from acting like second attack
    EVE.vca.gain.cancelScheduledValues(EVE.synth.currentTime);

    // Set starting point
    EVE.vca.gain.setValueAtTime(releasePeak, EVE.synth.currentTime);

    EVE.vca.gain.setTargetAtTime(EVE.program.vca_g, EVE.synth.currentTime, EVE.program.vca_r);
    return;
};

EVE.calculatePitch = function (note) {
    'use strict';
    var i;

    for (i = 0; i < EVE.config.harmonics; i += 1) {
        EVE.harmonicOscs[i].detune.setValueAtTime(note, EVE.synth.currentTime);
    }
    return;
};

EVE.slider = {
    grab: function () {
        'use strict';
        var prog = this.dataset.program,
            x = this.dataset.curve === 'lin' ? 1 : this.value;

        // Update program
        EVE.program[prog] = this.value * x;

        // Broadcast change
        this.dispatchEvent(EVE.events.update);

        if (x === 1) {
            console.log('LINEAR UPDATE');
        }
    },

    update: function (e) {
        'use strict';
        var p = e.target.dataset.program;

        switch (p) {
        // Harmonic Oscillators
        case 'osc1':
        case 'osc2':
        case 'osc3':
        case 'osc4':
        case 'osc5':
        case 'osc6':
        case 'osc7':
        case 'osc8':
            // Exponential
            EVE[p + '_vca'].gain.setValueAtTime(EVE.program[p], EVE.now());
            break;
        case 'vca_g':
            EVE.vca.gain.setValueAtTime(EVE.program.vca_g, EVE.now());
            console.log('VCA gain moved!');
            break;
        }
    }
};

(function bindSliders() {
    'use strict';
    var inputs = document.querySelectorAll('input[type=range]'),
        i;

    for (i = 0; i < inputs.length; i += 1) {
        inputs[i].addEventListener('input', EVE.slider.grab);
    }

}());

// Try creating a custom event for history state change
// Dispatch that event and listen for it on window

(function documentReady() {
    'use strict';

    // Set up templates
    navTemplate();

    // Set up synth
    EVE.buildSynth();
    EVE.buildScope();

    // Actually belongs in this function
    EVE.keyboard = document.getElementById('keyboard');

    EVE.keyboard.addEventListener('mousedown', EVE.gateOn);
    EVE.keyboard.addEventListener('touchstart', EVE.gateOn);
    EVE.keyboard.addEventListener('mouseup', EVE.gateOff);
    EVE.keyboard.addEventListener('touchend', EVE.gateOff);

    document.addEventListener('update', EVE.slider.update);

}());

(function collapsibleModules() {
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

EVE.testBuild = function () {
    'use strict';
    var x = {
        page: 'build'
    };
    history.pushState(x, '', 'build');
    window.dispatchEvent(EVE.events.navigate);
    console.log('Test build called', history.state.page);
};

EVE.testRegister = function () {
    'use strict';
    var x = {
        page: 'register'
    };
    history.pushState(x, '', 'register');
    window.dispatchEvent(EVE.events.navigate);
    console.log('Test register called', history.state.page);
};

EVE.historyChange = function () {
    'use strict';
    console.log('History pop state going on');
};

EVE.router = function (e) {
    'use strict';
    console.log('Router activated', history.state.page);
    switch (history.state.page) {
    case 'build':
        console.log('Go to build page');
        break;
    case 'register':
        console.log('Go to registration page');
        console.dir(e);
        break;
    default:
        console.log('404 page, man.');
    }
};

// Event listeners
//EVE.buildButton.addEventListener('click', EVE.testBuild);
//EVE.registerButton.addEventListener('click', EVE.testRegister);

window.addEventListener('popstate', EVE.historyChange);
window.addEventListener('navigate', EVE.router);
