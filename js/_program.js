EVE = (function (module) {
    'use strict';
    var bank = [
        'init',
        'cool-sci-fi-sound',
        'distorted-sawtooth',
        'miranda',
        'oranges',
        'peach-fuzz',
        'percusso',
        'problematic-patch',
        'test-lfo1',
        'test-lfo2',
        'test-patch',
        'work-song'
    ],
        displayName = document.getElementById('display-name'),
        number = 0,
        numberOfPresets = bank.length - 1,
        presetBank = document.getElementById('preset-bank'),
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
            } else {
                if (event.target === displayName) {
                    console.log(presetBank.dataset.state);
                    presetBank.dataset.state = presetBank.dataset.state === 'open' ? 'closed' : 'open';
                }
                if (event.target.value) {
                    number = bank.indexOf(event.target.value);
                    presetBank.dataset.state = 'closed';
                    return module.program.loadPreset(number);
                }
            }

            return;
        },

        load: function () {
            displayName.textContent = module.preset.name;
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
        }

    };

    document.addEventListener('loadpreset', module.program.load);
    program.addEventListener('click', module.program.cycle);

    return module;
}(EVE));
