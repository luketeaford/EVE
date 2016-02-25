// TODO Consider moving shiftOctave to performance controls
EVE = (function (module) {
    'use strict';
    var buttons = document.getElementsByClassName('shift-octave'),
        debug,
        i,
        keyDown,
        pitch,
        playing = [],
        qwertyPitches = {
            65: -2100,
            87: -2000,
            83: -1900,
            69: -1800,
            68: -1700,
            70: -1600,
            84: -1500,
            71: -1400,
            89: -1300,
            72: -1200,
            85: -1100,
            74: -1000,
            75: -900,
            79: -800,
            76: -700,
            80: -600,
            186: -500,
            222: -400,
            221: -300
        };

    // TODO Remove this
    module.harmonicOscillator.osc1.type = 'sawtooth';

    module.keyboard = {
        lights: document.querySelectorAll('#performance [data-light]'),
        keys: document.querySelectorAll('#keyboard button'),
        octaveShift: 0,
        scope: document.getElementById('keyboard'),

        shiftOctave: function (direction) {
            var oct = module.keyboard.octaveShift,
                shift = this.dataset ? this.dataset.shift : direction;

            function switchLights() {
                var n = module.keyboard.octaveShift + 2;

                for (i = 0; i < module.keyboard.lights.length; i += 1) {
                    module.keyboard.lights[i].dataset.light = i === n ? 'on' : 'off';
                }
            }

            if ((oct > -2 && shift < 0) || (oct < 2 && shift > 0)) {
                module.keyboard.octaveShift = oct + parseFloat(shift);
                switchLights();
            }

            // DEBUG
            debug = false;
            if (debug && console) {
                console.log(module.keyboard.octaveShift);
            }
        },

        convertQwertyToPitch: function (keycode) {
            return qwertyPitches[keycode];
        },

        pressBus: function (e) {
            switch (e.which) {
            // z
            case 122:
                module.keyboard.shiftOctave(-1);
                break;
            // x
            case 120:
                module.keyboard.shiftOctave(1);
                break;
            // `
            case 96:
                if (console) {
                    console.log(module.preset);
                }
                break;
            }

            // DEBUG
            if (debug && console) {
                console.log('PRESS:', e.which);
            }
        },

        downBus: function (e) {
            pitch = module.keyboard.convertQwertyToPitch(e.which);

            if (pitch) {
                if (playing.indexOf(pitch) === -1) {
                    playing.push(pitch);
                    playing.sort(function (a, b) {
                        return a - b;
                    });
                }
                if (!keyDown) {
                    keyDown = !keyDown;
                    module.gate();
                }
                module.calculatePitch(pitch);
            }

            if (debug && console) {
                console.log(playing);
            }
        },

        upBus: function (e) {
            pitch = module.keyboard.convertQwertyToPitch(e.which);

            if (pitch) {
                playing.splice(playing.indexOf(pitch), 1);
                if (playing.length >= 1) {
                    module.calculatePitch(playing[playing.length - 1]);
                } else {
                    keyDown = !keyDown;
                    module.gate();
                }
            }

            if (debug && console) {
                console.log(playing, e);
            }
        }

    };

    for (i = 0; i < buttons.length; i += 1) {
        buttons[i].addEventListener('click', module.keyboard.shiftOctave);
        buttons[i].addEventListener('touchstart', module.keyboard.shiftOctave);
    }

    document.addEventListener('keypress', module.keyboard.pressBus);
    document.addEventListener('keydown', module.keyboard.downBus);
    document.addEventListener('keyup', module.keyboard.upBus);

    return module;
}(EVE));
