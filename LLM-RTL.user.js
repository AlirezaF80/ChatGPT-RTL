// ==UserScript==
// @name         ChatGPT RTL
// @namespace    http://chat.openai.com
// @namespace    http://deepseek.com
// @author       Alireza Farzaneh
// @version      0.1.2.1
// @description  Fixes the direction of RTL languages in LLM's interface
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @match        https://chat.deepseek.com/*
// @match        https://claude.ai/*
// @match        https://chat.qwen.ai/*
// @grant        none
// ==/UserScript==

;(function() {
    "use strict";
    const RTL_REGEX = /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

    const styleId = 'deepseek-rtl-fix-style';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .deepseek-rtl-applied, .deepseek-rtl-applied * {
                direction: rtl !important;
                text-align: right !important;
            }
        `;
        document.head.appendChild(style);
    }

    function applyRTLToNode(node) {
        if (!node) return;
        let elem = null;
        if (node.nodeType === Node.TEXT_NODE) {
            elem = node.parentElement;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            elem = node;
        }
        if (!elem) return;

        if (elem.closest('.deepseek-rtl-applied')) return;

        const txt = elem.textContent || "";
        if (RTL_REGEX.test(txt)) {
            elem.classList.add('deepseek-rtl-applied');
        }
    }

    function initialScan(root) {
        if (!root) root = document.body;
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
        let cur;
        while ((cur = walker.nextNode())) {
            applyRTLToNode(cur);
        }
    }

    initialScan(document.body);

    const observer = new MutationObserver((mutations) => {
        for (const mut of mutations) {
            if (mut.type === 'childList') {
                for (const nd of mut.addedNodes) {
                    applyRTLToNode(nd);
                    if (nd.nodeType === Node.ELEMENT_NODE) {
                        initialScan(nd);
                    }
                }
            } else if (mut.type === 'characterData') {
                applyRTLToNode(mut.target);
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });

})();
