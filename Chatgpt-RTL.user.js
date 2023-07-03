// ==UserScript==
// @name         ChatGPT RTL
// @namespace    http://chat.openai.com
// @author       Alireza Farzaneh
// @version      0.1.0
// @description  Changes the direction of Persian text on ChatGPT interface to RTL
// @match        https://chat.openai.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const PERSIAN_REGEX = /[\u0600-\u06FF\uFB8A\u067E\u0686\u06AF\u200C\u200F]+/;

    // Function to check if a given string contains Persian text
    function containsPersianText(text) {
        return PERSIAN_REGEX.test(text);
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
            if (childNode.nodeType === Node.TEXT_NODE && containsPersianText(childNode.textContent)) {
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
