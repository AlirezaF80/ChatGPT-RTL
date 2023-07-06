// ==UserScript==
// @name         ChatGPT RTL
// @namespace    http://chat.openai.com
// @author       Alireza Farzaneh
// @version      0.1.2
// @description  Fixes the direction of RTL languages in ChatGPT's interface
// @match        https://chat.openai.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    const PERSIAN_REGEX = /[\u0600-\u06FF\uFB8A\u067E\u0686\u06AF\u200C\u200F]+/;
    const HEBREW_REGEX = /[\u0590-\u05FF\uFB1D-\uFB4F]+/;
    const ARABIC_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDCF\uFDF0-\uFDFF\uFE70-\uFEFF]+/;
    const RTL_REGEX = new RegExp(PERSIAN_REGEX.source + '|' + HEBREW_REGEX.source + '|' + ARABIC_REGEX.source);

    function containsRTLText(text) {
        return RTL_REGEX.test(text);
    }

    function changeTextElementDirection(element) {
        element.parentNode.setAttribute('dir', 'rtl');
    }

    function isAlreadyModified(element) {
        return element.parentNode.getAttribute('dir') === 'rtl';
    }

    function modifyPersianTextElements(element) {
        var childNodes = element.childNodes;
        for (var i = 0; i < childNodes.length; i++) {
            var childNode = childNodes[i];
            if (childNode.nodeType === Node.TEXT_NODE) {
                if (isAlreadyModified(childNode)) {
                    continue;
                }
                if (containsRTLText(childNode.textContent)) {
                    changeTextElementDirection(childNode);
                }
            } else if (childNode.nodeType === Node.ELEMENT_NODE) {
                modifyPersianTextElements(childNode);
            }
        }
    }

    function handleMutations(mutationsList) {
        for (let i = 0; i < mutationsList.length; i++) {
            const mutation = mutationsList[i];
            modifyPersianTextElements(mutation.target.parentNode);
        }
    }

    modifyPersianTextElements(document.body);

    var observer = new MutationObserver(handleMutations);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, characterData: true });
})();
