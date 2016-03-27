EVE = (function (module) {
    'use strict';
    var promptDialog = document.getElementById('consent-prompt');

    module.prompt = {
        preventScroll: function (event) {
            event.preventDefault();
            return;
        },

        removePrompt: function () {
            promptDialog.style.display = 'none';

            promptDialog.removeEventListener('touchmove', module.prompt.preventScroll);

            promptDialog.removeEventListener('click', module.prompt.removePrompt);
            promptDialog.removeEventListener('mousedown', module.prompt.removePrompt);
            promptDialog.removeEventListener('touchend', module.prompt.removePrompt);

        }
    };

    if (module.promptNecessary) {

        promptDialog.style.display = 'flex';

        promptDialog.addEventListener('touchmove', module.prompt.preventScroll);

        promptDialog.addEventListener('click', module.prompt.removePrompt);
        promptDialog.addEventListener('mousedown', module.prompt.removePrompt);
        promptDialog.addEventListener('touchend', module.prompt.removePrompt);
    }

    return module;
}(EVE));
