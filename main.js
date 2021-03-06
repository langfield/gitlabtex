// ==UserScript==
// @name         Gitlab KaTeX Rendering Fix
// @namespace    http://gitlab.com/
// @version      0.1
// @description  Fix Gitlab's garbage anti-DDOS KaTeX rendering limits
// @author       William Blake
// @match        https://gitlab.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// ==/UserScript==


function addScript(text, tag) {
    // Patch the relevant bits.
    console.log("Replacing limits in script src...")
    text = text.replace("=1e3,", "=1e6,");
    text = text.replace("=2e3,", "=2e6,");
    // TODO: replace variable names (subject to change because they're generated by the minifier) with regex patterns.
    text = text.replace("r=Boolean(t),", "r=false,");

    // Create a new script tag to contain our patched ``main.*.chunk.js``.
    var newTag = document.createElement('script');
    newTag.text = text;

    // Patch the nonce.
    console.log("Patching nonce...")
    const nonce = tag.nonce;
    newTag.setAttribute("nonce", nonce);

    // Add the patched tag to the document.
    document.body.appendChild(newTag);
    console.log("Done!")
}



(function() {
    'use strict';

    // Your code here...
    // This is the userscript code, which runs at the beginning of pageload
    // Say we wanted to prevent the loading of the jQuery script tag below:
    new MutationObserver((_, observer) => {
            const mainScriptTag = document.querySelector('script[src*="main"]');
            if (mainScriptTag) {
                console.log('Found main.*.chunk.js script tag; now removing it!');
                mainScriptTag.remove();
                console.log("Grabbing existing src of tag...")
                GM_xmlhttpRequest({
                    method: "GET",
                    url: mainScriptTag.src,
                    onload: function(response) {
                        addScript(response.responseText, mainScriptTag);
                    }
                });

                // We've done what we needed to do, no need for the MutationObserver anymore:
                observer.disconnect();
            }
        })
        .observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    console.log("Patching Gitlab KaTeX rendering limits...");

})();
