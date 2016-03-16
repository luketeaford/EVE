EVE = (function (module) {
    'use strict';

    var offset = -135,
        updateMethods = {
            'harmonic-oscillator': 'updateharmonicoscillator',
            'lfo1': 'updatelfo1',
            'lfo2': 'updatelfo2',
            'performance': 'updateperformance',
            'timbre-env': 'updatetimbreenv',
            'vca': 'updatevca'
        };

    module.slider = {
        grab: function (event) {
            var program,
                update;

            if (event.target.type === 'range') {
                program = event.target.dataset.program;

                update = updateMethods[event.target.parentElement.parentElement.parentElement.id];

                module.preset[program] = event.target.dataset.curve === 'lin' ?
                        event.target.value :
                        Math.sqrt(event.target.value);

                event.target.nextElementSibling.style.transform = module.slider.rotate(module.preset[program], event.target.min === '-1');

                return event.target.dispatchEvent(module.events[update]);
            }

            return;
        },

        rotate: function (x, unipolar) {
            var r = unipolar ? x * 135 : x * 270 + offset;

            return 'rotate(' + r + 'deg)';
        }
    };

    document.addEventListener('input', module.slider.grab);

    return module;
}(EVE));
