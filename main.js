// ==UserScript==
// @name         Gitlab KaTeX Rendering Fix
// @namespace    http://gitlab.com/
// @version      0.1
// @description  Fix Gitlab's garbage anti-DDOS KaTeX rendering limits
// @author       William Blake
// @match        https://gitlab.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-start
// @grant        GM.xmlhttpRequest
// ==/UserScript==


function addScript(text) {
    text = text.replace(/ = 1e3,/g, " = 1e6,");
    text = text.replace(/ = 1e3,/g, " = 2e6,");
    var newScript = document.createElement('script');
    newScript.type = "text/javascript";
    newScript.textContent = text;
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(newScript);
}


(function() {
    'use strict';

    // Your code here...
    // This is the userscript code, which runs at the beginning of pageload
    // Say we wanted to prevent the loading of the jQuery script tag below:
    new MutationObserver((_, observer) => {
      const mainScriptTag = document.querySelector('script[src*="main"]');
      console.log(mainScriptTag)
      if (mainScriptTag) {
        console.log('Found main.*.chunk.js script tag; now removing it!');
        mainScriptTag.remove();

        GM.xmlhttpRequest({
            method: "GET",
            url: mainScriptTag.src,
            onload: function(response) {
                addScript(response.responseText);
            }
        });

        // We've done what we needed to do, no need for the MutationObserver anymore:
        observer.disconnect();
      }
    })
      .observe(document.documentElement, { childList: true, subtree: true });
    console.log("hello!");

})();
