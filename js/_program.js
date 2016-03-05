EVE = (function (module) {
    'use strict';
    var bank = [
        'init',
        'distorted-sawtooth',
        'test-patch',
        'cool-sci-fi-sound',
        'problematic-patch'
    ],
        displayName = document.getElementById('display-name'),
        nextPreset = document.getElementById('next-preset'),
        number = 0,
        numberOfPresets = bank.length - 1,
        prevPreset = document.getElementById('prev-preset');

    module.program = {
        cycle: function (n) {
            var i = n && n < 0 ? -1 : 1,
                x = number + i;

            if (x >= 0 && x <= numberOfPresets) {
                number = x;
            }

            return module.program.loadPreset(number);
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

    module.program.cycleBackward = module.program.cycle.bind(null, -1);
    module.program.cycleForward = module.program.cycle.bind(null, 1);

    nextPreset.addEventListener('click', module.program.cycleForward);
    prevPreset.addEventListener('click', module.program.cycleBackward);
    document.addEventListener('loadpreset', module.program.load);

    return module;
}(EVE));
