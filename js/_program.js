EVE = (function (module) {
    'use strict';
    var bank = [
        'init',
        'test-lfo2',
        'test-lfo1',
        'distorted-sawtooth',
        'miranda',
        'percusso',
        'oranges',
        'test-patch',
        'cool-sci-fi-sound',
        'problematic-patch'
    ],
        displayName = document.getElementById('display-name'),
        number = 0,
        numberOfPresets = bank.length - 1,
        program = document.getElementById('program');

    module.program = {
        cycle: function (direction) {
            var i = 0,
                x = parseFloat(event.target.dataset.cycle) || direction;

            if (event.target.dataset.cycle || event.type === 'keypress') {
                i = number + x;
                if (i >= 0 && i <= numberOfPresets) {
                    number += x;
                    return module.program.loadPreset(number);
                }
            }

            return;
        },

        loadPreset: function (index) {
            var ajax = new XMLHttpRequest();

            ajax.open('GET', '/presets/' + bank[index] + '.json', true);

            ajax.onload = function () {
                var data;

                if (ajax.status >= 200 && ajax.status < 400) {
                    data = JSON.parse(ajax.responseText);
                    module.preset = data;
                    document.dispatchEvent(module.events.loadpreset);
                } else {
                    module.preset = module.defaultPreset;
                    document.dispatchEvent(module.events.loadpreset);
                }
            };

            ajax.send();

            return;
        },

        load: function () {
            displayName.textContent = module.preset.name;
            return;
        }
    };

    program.addEventListener('click', module.program.cycle);
    document.addEventListener('loadpreset', module.program.load);

    return module;
}(EVE));
