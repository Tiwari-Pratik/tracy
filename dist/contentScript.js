/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**************************************!*\
  !*** ./src/content/contentScript.ts ***!
  \**************************************/
chrome.runtime.sendMessage("message from the content script", (response) => {
    console.log(response);
});

/******/ })()
;
//# sourceMappingURL=contentScript.js.map