// ==UserScript==
// @name         ChatGPT RTL
// @namespace    http://chat.openai.com
// @author       Alireza Farzaneh
// @version      0.1.2
// @description  Fixes the direction of RTL languages in ChatGPT's interface
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @grant        none
// ==/UserScript==

;(function() {
    "use strict";
    
    var PERSIAN_REGEX = /[\u0600-\u06FF]/;
    var HEBREW_REGEX = /[\u0590-\u05FF]/;
    var ARABIC_REGEX = /[\u0600-\u06FF]/;
    var RTL_REGEX = new RegExp([PERSIAN_REGEX.source, HEBREW_REGEX.source, ARABIC_REGEX.source].join("|"));

    function containsRTLText(text) {
        return RTL_REGEX.test(text);
    }

    function changeTextElementDirection(element) {
        if (element.parentNode) {
            const parentElement = element.parentNode;
            parentElement.setAttribute('dir', 'rtl');
            parentElement.style.cssText += 'text-align: right !important; direction: rtl !important;';
            
            // Apply to parent containers to ensure proper alignment
            let currentElement = parentElement;
            while (currentElement && currentElement !== document.body) {
                if (currentElement.classList.contains('markdown-content') || 
                    currentElement.classList.contains('text-message') ||
                    /^H[1-6]$/.test(currentElement.tagName)) {
                    currentElement.style.cssText += 'text-align: right !important; direction: rtl !important;';
                }
                currentElement = currentElement.parentElement;
            }
        }
    }

    function isAlreadyModified(element) {
        return element.parentNode.getAttribute('dir') === 'rtl';
    }

    function modifyPersianTextElements(element) {
        if (element === document.body) {
            const style = document.createElement('style');
            style.textContent = `
                .markdown-content, .text-message, 
                .markdown-content h1, .markdown-content h2, 
                .markdown-content h3, .markdown-content h4, 
                .markdown-content h5, .markdown-content h6,
                .markdown-content p, .markdown-content div,
                [dir="rtl"] {
                    text-align: right !important;
                    direction: rtl !important;
                }
            `;
            document.head.appendChild(style);
        }

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
    };

    modifyPersianTextElements(document.body);

    var observer = new MutationObserver(handleMutations);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, characterData: true });
})();
