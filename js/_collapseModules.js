(function collapseModules() {
    'use strict';
    var i,
        moduleTitles = document.querySelectorAll('section > a');

    function collapseMenu() {
        if (this.parentElement.dataset.state === 'open') {
            this.parentElement.dataset.state = 'closed';
        } else {
            this.parentElement.dataset.state = 'open';
        }
    }

    for (i = 0; i < moduleTitles.length; i += 1) {
        moduleTitles[i].addEventListener('click', collapseMenu);
    }
}());
