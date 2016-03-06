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
        grab: function (e) {
            var program,
                update,
                x;

            if (e.target.type === 'range') {
                program = e.target.dataset.program;
                update = updateMethods[e.path[2].id];
                x = e.target.dataset.curve === 'lin' ? 1 : e.target.value;

                module.preset[program] = e.target.value * x;

                e.target.dispatchEvent(module.events[update]);
            }

            return;
        }
    };

    document.addEventListener('input', module.slider.grab);

    return module;
}(EVE));
