EVE = (function (module) {
    'use strict';

    module.program = {
        load: function load() {
            var ajax = new XMLHttpRequest();

            ajax.open('GET', '/presets/cool-sci-fi-sound.json', true);

            ajax.onload = function () {
                var data;

                if (ajax.status >= 200 && ajax.status < 400) {
                    data = JSON.parse(ajax.responseText);
                    console.log(data);
                    module.preset = data;
                    document.dispatchEvent(module.events.loadPreset);
                } else {
                    data = module.preset;
                }
            };

            ajax.send();
        }
    };

    return module;
}(EVE));
