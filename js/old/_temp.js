// Try creating a custom event for history state change
// Dispatch that event and listen for it on window
(function documentReady() {
    'use strict';

    document.addEventListener('update', EVE.slider.update);
    document.addEventListener('update', EVE.button.update);
}());
