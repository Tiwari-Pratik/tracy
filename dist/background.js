/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!**************************************!*\
  !*** ./src/background/background.ts ***!
  \**************************************/
__webpack_require__.r(__webpack_exports__);
chrome.action.onClicked.addListener(function (tab) {
    chrome.tabs.create({
        url: chrome.runtime.getURL("popup.html"),
        active: true,
    });
});
let tabHistory = [];
function updatePopup() {
    // Send tab history to popup script
    chrome.runtime.sendMessage({
        action: "update",
        tabHistory: tabHistory,
    }, function (response) {
        console.log(response);
    });
}
chrome.tabs.query({}, function (tabs) {
    // On extension startup, include all existing tabs
    tabHistory = tabs.map((tab) => ({ type: "existing", tab }));
    updatePopup();
});
chrome.tabs.onCreated.addListener(function (newTab) {
    // tabHistory.push({ type: "created", tab });
    // updatePopup();
    tabHistory.push({ type: "created", tab: newTab });
    updatePopup();
});
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    const index = tabHistory.findIndex((item) => item.tab.id === tabId);
    if (index !== -1) {
        // If tab already exists in history, update it
        tabHistory[index] = { type: "updated", tab };
    }
    else {
        // If tab is not in history, add it as an existing tab
        tabHistory.push({ type: "existing", tab });
    }
    updatePopup();
});


/******/ })()
;
//# sourceMappingURL=background.js.map