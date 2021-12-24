// ==UserScript==
// @name         Gitlab KaTeX Rendering Fix
// @namespace    http://gitlab.com/
// @version      0.1
// @description  Fix Gitlab's garbage anti-DDOS KaTeX rendering limits
// @author       William Blake
// @match        https//www.gitlab.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // This is the userscript code, which runs at the beginning of pageload
    // Say we wanted to prevent the loading of the jQuery script tag below:
    new MutationObserver((_, observer) => {
      const mainScriptTag = document.querySelector('script[src^="main."]');
      console.log(mainScriptTag)
      if (mainScriptTag) {
        console.log('Found main.*.chunk.js script tag; now removing it!');
        mainScriptTag.remove();
        // We've done what we needed to do, no need for the MutationObserver anymore:
        observer.disconnect();
      }
    })
      .observe(document.documentElement, { childList: true, subtree: true });
})();
