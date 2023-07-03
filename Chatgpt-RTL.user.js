// ==UserScript==
// @name         ChatGPT RTL
// @namespace    http://chat.openai.com
// @author       Alireza Farzaneh
// @version      0.1.1
// @description  Fixes the direction of RTL languages in ChatGPT's interface
// @match        https://chat.openai.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const PERSIAN_REGEX = /[\u0600-\u06FF\uFB8A\u067E\u0686\u06AF\u200C\u200F]+/;
    const HEBREW_REGEX = /[\u0590-\u05FF\uFB1D-\uFB4F]+/;
    const ARABIC_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDCF\uFDF0-\uFDFF\uFE70-\uFEFF]+/;
    const RTL_REGEX = new RegExp(PERSIAN_REGEX.source + '|' + HEBREW_REGEX.source + '|' + ARABIC_REGEX.source);

    // Function to check if a given string contains a text in any RTL language
    function containsRTLText(text) {
        return RTL_REGEX.test(text);
    }

    // Function to modify a single text node
    function changeTextElementDirection(element) {
        element.parentNode.setAttribute('dir', 'rtl');
    }

    // Function to recursively search and modify elements containing Persian text
    function modifyPersianTextElements(element) {
        var childNodes = element.childNodes;
        for (var i = 0; i < childNodes.length; i++) {
            var childNode = childNodes[i];
            if (childNode.nodeType === Node.TEXT_NODE && containsRTLText(childNode.textContent)) {
                changeTextElementDirection(childNode);
            } else if (childNode.nodeType === Node.ELEMENT_NODE) {
                modifyPersianTextElements(childNode);
            }
        }
    }

    // Function to handle mutation events
    function handleMutations(mutationsList) {
        for (var i = 0; i < mutationsList.length; i++) {
            var mutation = mutationsList[i];
            if (mutation.type === 'childList') {
                var addedNodes = mutation.addedNodes;
                for (var j = 0; j < addedNodes.length; j++) {
                    var addedNode = addedNodes[j];
                    if (addedNode.nodeType === Node.ELEMENT_NODE) {
                        modifyPersianTextElements(addedNode);
                    }
                }
            }
        }
    }

    // Modify elements containing Persian text
    modifyPersianTextElements(document.body);

    // Watch for DOM mutations and apply RTL direction to newly added Persian text
    var observer = new MutationObserver(handleMutations);
    observer.observe(document.body, { childList: true, subtree: true });
})();
