// Modified from markdown.js from Hakim to handle external html files
(function () {
    /*jslint loopfunc: true, browser: true*/
    /*globals alert*/
    'use strict';

    var querySlidingHtml = function () {
        var sections = document.querySelectorAll('[data-html]'),
            section, j, jlen;

        for (j = 0, jlen = sections.length; j < jlen; j++) {
            section = sections[j];
            var id = 'htmlslide'+j;

            if (section.getAttribute('data-html').length) {

                var xhr = new XMLHttpRequest(),
                    url = section.getAttribute('data-html'),
                    cb = function () {
                        if (xhr.readyState === 4) {
                            if (
                                (xhr.status >= 200 && xhr.status < 300) ||
                                xhr.status === 0 // file protocol yields status code 0 (useful for local debug, mobile applications etc.)
                            ) {
                                section.innerHTML = xhr.responseText;
                            } else {
                                section.outerHTML = '<section data-state="alert">ERROR: The attempt to fetch ' + url + ' failed with the HTTP status ' + xhr.status + '. Check your browser\'s JavaScript console for more details.</p></section>';
                            }
                        }
                    };

                xhr.onreadystatechange = cb;

                xhr.open('GET', url, false);
                try {
                    xhr.send();
                } catch (e) {
                    alert('Failed to get file' + url + '.' + e);
                }
            }

            if (section.getAttribute('data-js') !== null) {
                // make sure we set a statename to the section if not present
                if (section.getAttribute('data-state') === null) {
                    section.setAttribute('data-state',id);
                }

                var jsxhr = new XMLHttpRequest(),
                    jsurl = section.getAttribute('data-js'),
                    jscb = function () {
                        if (jsxhr.readyState === 4) {
                            if (
                                (jsxhr.status >= 200 && jsxhr.status < 300) ||
                                jsxhr.status === 0 // file protocol yields status code 0 (useful for local debug, mobile applications etc.)
                            ) {
                                var script = document.createElement('script')
                                script.innerText = "Reveal.addEventListener('"+id+"',function () {\n"+
                                    jsxhr.responseText+"\n},false);";
                                section.appendChild(script)
                            } else {
                                console.log("Failed to load script "+jsurl);
                            }
                        }
                    };

                jsxhr.onreadystatechange = jscb;

                jsxhr.open('GET', jsurl, false);
                try {
                    jsxhr.send();
                } catch (e) {
                    console.error('Failed to get file' + jsurl + '.' + e);
                }
            }

        }
    };

    querySlidingHtml();
})();
