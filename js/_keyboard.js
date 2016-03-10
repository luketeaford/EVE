EVE = (function (module) {
    'use strict';
    var key,
        keyDown,
        pitch,
        playing = [],
        qwertyKeys = {
            65: 0,
            87: 1,
            83: 2,
            69: 3,
            68: 4,
            70: 5,
            84: 6,
            71: 7,
            89: 8,
            72: 9,
            85: 10,
            74: 11,
            75: 12,
            79: 13,
            76: 14,
            80: 15,
            186: 16,
            222: 17,
            221: 18
        },
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

    module.keyboard = {
        keys: document.querySelectorAll('#keyboard button'),

        convertQwertyToPitch: function (keycode) {
            return qwertyPitches[keycode];
        },

        highlightKey: function (keycode) {
            key = qwertyKeys[keycode];

            module.keyboard.keys[key].dataset.active =
                module.keyboard.keys[key].dataset.active === 'false' ?
                        'true' :
                        'false';
            return;
        },

        pressBus: function (event) {
            switch (event.which) {
            // ,
            case 44:
                module.program.cycle(-1);
                break;
            // .
            case 46:
                module.program.cycle(1);
                break;
            // z
            case 122:
                module.performance.shiftOctave(null, -1);
                break;
            // x
            case 120:
                module.performance.shiftOctave(null, 1);
                break;
            }
            return;
        },

        downBus: function (event) {
            pitch = module.keyboard.convertQwertyToPitch(event.which);

            if (pitch) {
                if (playing.indexOf(pitch) === -1) {
                    module.calculatePitch(null, pitch);
                    module.keyboard.highlightKey(event.which);
                    playing.push(pitch);
                    playing.sort(function (a, b) {
                        return a - b;
                    });
                }
                if (!keyDown) {
                    keyDown = !keyDown;
                    module.gate();
                }
            }
            return;
        },

        upBus: function (event) {
            pitch = module.keyboard.convertQwertyToPitch(event.which);

            if (pitch) {
                playing.splice(playing.indexOf(pitch), 1);
                if (playing.length >= 1) {
                    module.calculatePitch(null, playing[playing.length - 1]);
                } else {
                    keyDown = !keyDown;
                    module.gate();
                }
                module.keyboard.highlightKey(event.which);

            }
            return;
        }
    };

    document.addEventListener('keypress', module.keyboard.pressBus);
    document.addEventListener('keydown', module.keyboard.downBus);
    document.addEventListener('keyup', module.keyboard.upBus);

    return module;
}(EVE));
