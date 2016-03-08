EVE = (function (module) {
    'use strict';

    var updateMethods = {
        'harmonic-oscillator': 'updateharmonicoscillator',
        'lfo1': 'updatelfo1',
        'lfo2': 'updatelfo2',
        'performance': 'updateperformance',
        'timbre-env': 'updatetimbreenv',
        'vca': 'updatevca'
    };

    module.slider = {
        grab: function () {
            var program,
                update,
                x;

            if (event.target.type === 'range') {
                program = event.target.dataset.program;
                update = updateMethods[event.path[2].id];
                x = event.target.dataset.curve === 'lin' ? 1 : event.target.value;

                module.preset[program] = event.target.value * x;

                return event.target.dispatchEvent(module.events[update]);
            }

            return;
        }
    };

    document.addEventListener('input', module.slider.grab);

    return module;
}(EVE));
