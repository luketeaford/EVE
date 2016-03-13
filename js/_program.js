EVE = (function (module) {
    'use strict';
    var bank = [
        'init',
        'test-ribbon',
        'mirage',
        'square-overtone',
        'cool-sci-fi-sound',
        'distorted-sawtooth',
        'miranda',
        'peach-fuzz',
        'percusso',
        'problematic-patch',
        'test-lfo1',
        'test-lfo2',
        'test-patch',
        'work-song'
    ],
        display = document.getElementById('display'),
        displayName = document.querySelector('#display > h3'),
        number = 0,
        numberOfPresets = bank.length - 1,
        presetBank = document.getElementById('preset-bank'),
        program = document.getElementById('program');

    module.program = {

        cycle: function (event, direction) {
            var i,
                offset = direction || parseFloat(event.target.dataset.cycle);

            if (offset) {
                i = number + offset;
                if (i >= 0 && i <= numberOfPresets) {
                    number += offset;
                    return module.program.loadPreset(number);
                }
            }

            if (event) {
                // Click display to open/close preset bank
                if (event.path.indexOf(display) >= 0) {
                    module.program.togglePresetBank();
                }

                // Load selected preset and close preset bank
                if (event.target.value) {
                    number = bank.indexOf(event.target.value);
                    module.program.togglePresetBank();
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
        },

        togglePresetBank: function () {
            presetBank.dataset.state =
                presetBank.dataset.state === 'closed' ?
                        'open' :
                        'closed';
            return;
        }


    };

    document.addEventListener('loadpreset', module.program.load);
    program.addEventListener('click', module.program.cycle);

    return module;
}(EVE));
