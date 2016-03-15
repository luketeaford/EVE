EVE = (function (module) {
    'use strict';

    var updateMethods = {
        'harmonic-oscillator': 'updateharmonicoscillator',
        'lfo1': 'updatelfo1',
        'lfo2': 'updatelfo2',
        'performance': 'updateperformance',
        'timbre-env': 'updatetimbreenv',
        'vca': 'updatevca'
    },
        oscInput = document.querySelector('input[type=range]');

    module.slider = {
        grab: function (event) {
            var program,
                update,
                x;

            if (event.target.type === 'range') {
                program = event.target.dataset.program;
                update = updateMethods[event.target.parentElement.parentElement.id];
                x = event.target.dataset.curve === 'lin' ? 1 : event.target.value;
                module.preset[program] = event.target.value * x;
                // EXPERIMENT
                event.target.nextElementSibling.style.transform = 'rotate(' + (-135 + (x * 270)) + 'deg)';

                return event.target.dispatchEvent(module.events[update]);
            }

            return;
        },

        test: function (event) {
            event.target.parentElement.style.backgroundColor = '#ff0';
            return;
        }
    };

    document.addEventListener('input', module.slider.grab);
    oscInput.addEventListener('mousedown', module.slider.test);
    oscInput.addEventListener('touchstart', module.slider.test);

    return module;
}(EVE));
