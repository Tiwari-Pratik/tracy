/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/utils/storage.ts":
/*!******************************!*\
  !*** ./src/utils/storage.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getTabStates: () => (/* binding */ getTabStates),
/* harmony export */   setTabStates: () => (/* binding */ setTabStates)
/* harmony export */ });
const setTabStates = (tabsInfoData) => {
    // let existingState: TabInfo[][] = [];
    // getTabStates().then((tabsArray) => {
    //   existingState = tabsArray;
    // });
    // if (existingState.length !== 0) {
    //   existingState.push(tabsInfoData);
    // }
    const vals = {
        tabStates: tabsInfoData,
    };
    return new Promise((resolve) => {
        chrome.storage.local.set(vals, () => resolve());
        // chrome.runtime.sendMessage({ action: "update" });
    });
};
const getTabStates = () => {
    const keys = ["tabStates"];
    return new Promise((resolve) => {
        chrome.storage.local.get(keys, (res) => {
            var _a;
            resolve((_a = res.tabStates) !== null && _a !== void 0 ? _a : []);
        });
    });
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
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
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**************************************!*\
  !*** ./src/background/background.ts ***!
  \**************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/storage */ "./src/utils/storage.ts");

let existingTabId = null;
chrome.runtime.onInstalled.addListener((event) => {
    (0,_utils_storage__WEBPACK_IMPORTED_MODULE_0__.setTabStates)([]);
});
chrome.action.onClicked.addListener(function (tab) {
    if (existingTabId) {
        chrome.tabs.get(existingTabId, function (tab) {
            if (chrome.runtime.lastError) {
                chrome.tabs.create({ url: "popup.html" }, function (newTab) {
                    existingTabId = newTab.id;
                });
            }
            else {
                // If the tab is already open, switch to it
                chrome.tabs.update(existingTabId, { active: true });
            }
        });
    }
    else {
        // If the tab is not open, create a new one
        chrome.tabs.create({ url: "popup.html" }, function (newTab) {
            existingTabId = newTab.id;
        });
    }
});
let tabInfo = [];
let globalTabState = [];
// let tabSyncState: TabNodes[] = [];
let tabIdList = [];
let childTabIdList = [];
let removedTabIdList = [];
// let allTabStates: Omit<TabNodes, "childNodes">[] = [];
let historyStates = [];
let globalIndex = 0;
// const getAllTabsInfo = () => {
//   chrome.tabs.query({}, function (tabs: chrome.tabs.Tab[]) {
//     const tabsArr: OriginalTabInfo[] = [];
//     tabs.forEach((tab) => {
//       tabsArr.push({
//         id: tab.id,
//         index: tab.index,
//         url: tab.url,
//         title: tab.title,
//       });
//     });
//     originalTabsInfo.tabsData = tabsArr;
//   });
// };
const syncStatesFirstTime = () => {
    tabInfo.forEach((tab) => {
        const nodeData = {
            type: tab.type,
            url: tab.url,
            hasPrevious: false,
            hasChild: false,
            title: tab.title,
            id: tab.id,
            globalIndex: tab.globalIndex,
        };
        const nodeInfo = [nodeData];
        historyStates.push({
            node: nodeInfo,
        });
    });
};
const findNode = (state, index) => {
    for (const node of state) {
        traverse(node, index);
    }
};
const traverse = (nodes, index) => {
    for (const node of nodes.node) {
        if (node.globalIndex === index) {
        }
    }
};
const syncStateFromId = (id) => {
    const ind = tabInfo.findIndex((tab) => tab.id === id);
    if (!tabInfo[ind].hasOpenerId) {
        const nodeData = {
            type: tabInfo[ind].type,
            url: tabInfo[ind].url,
            hasPrevious: false,
            hasChild: false,
            title: tabInfo[ind].title,
            id: tabInfo[ind].id,
            globalIndex: tabInfo[ind].globalIndex,
        };
        const nodeInfo = [nodeData];
        historyStates.push({
            node: nodeInfo,
        });
    }
    else {
    }
};
// adding all the opened tabs for the first time
chrome.tabs.query({}, function (tabs) {
    tabs.forEach((tab) => {
        tabIdList.push(tab.id);
        globalIndex += 1;
        tabInfo.push({
            type: "existing",
            id: tab.id,
            index: tab.index,
            url: tab.url,
            title: tab.title,
            childId: [],
            changeLog: { url: [], title: [], id: [] },
            hasOpenerId: false,
            globalIndex: globalIndex,
        });
    });
    globalTabState = tabInfo;
    syncStatesFirstTime();
    (0,_utils_storage__WEBPACK_IMPORTED_MODULE_0__.setTabStates)(globalTabState);
    console.log({ tabInfo });
    // console.log({ tabIdList });
    // console.log({ updatedTabIdList });
    // console.log({ childTabIdList });
    // console.log({ removedTabIdList });
    // console.log({ replacedTabIdList });
});
// tracking when a new tab is created
chrome.tabs.onCreated.addListener((newTab) => {
    tabIdList.push(newTab.id);
    globalIndex = +1;
    tabInfo.push({
        type: "created",
        id: newTab.id,
        index: newTab.index,
        childId: [],
        changeLog: { url: [], title: [], id: [] },
        hasOpenerId: false,
        globalIndex: globalIndex,
    });
    if (newTab.openerTabId) {
        childTabIdList.push(newTab.id);
        const ind = tabInfo.findIndex((tab) => tab.id === newTab.openerTabId);
        tabInfo[ind].childId.push(newTab.id);
        tabInfo[ind].type = "child added";
        const cind = tabInfo.findIndex((tab) => tab.id === newTab.id);
        (tabInfo[cind].hasOpenerId = true),
            (tabInfo[cind].openerId = newTab.openerTabId);
    }
    globalTabState = tabInfo;
    (0,_utils_storage__WEBPACK_IMPORTED_MODULE_0__.setTabStates)(globalTabState);
    // syncTabsfromInfo();
    // console.log({ allTabStates });
    console.log({ tabInfo });
    // console.log({ tabIdList });
    // console.log({ updatedTabIdList });
    // console.log({ childTabIdList });
    // console.log({ removedTabIdList });
    // console.log({ replacedTabIdList });
});
//tracking when a tab is deleted
chrome.tabs.onRemoved.addListener((tabId) => {
    removedTabIdList.push(tabId);
    const ind = tabInfo.findIndex((tab) => tab.id === tabId);
    tabInfo[ind].type = "removed";
    globalTabState = tabInfo;
    (0,_utils_storage__WEBPACK_IMPORTED_MODULE_0__.setTabStates)(globalTabState);
    // syncTabsfromInfo();
    // console.log({ allTabStates });
    console.log({ tabInfo });
    // console.log({ tabIdList });
    // console.log({ updatedTabIdList });
    // console.log({ childTabIdList });
    // console.log({ removedTabIdList });
    // console.log({ replacedTabIdList });
});
// tracking all the tab updates
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    // console.log({ changeInfo });
    var _a, _b, _c;
    const ind = tabInfo.findIndex((tab) => tab.id === tabId);
    if (ind !== -1) {
        if (tabInfo[ind].changeLog) {
            tabInfo[ind].type = "updated";
        }
        (_a = tabInfo[ind].changeLog.id) === null || _a === void 0 ? void 0 : _a.push(tabId);
        if (changeInfo.url) {
            (_b = tabInfo[ind].changeLog.url) === null || _b === void 0 ? void 0 : _b.push(changeInfo.url);
        }
        if (changeInfo.title) {
            (_c = tabInfo[ind].changeLog.title) === null || _c === void 0 ? void 0 : _c.push(changeInfo.title);
        }
    }
    syncTabInfo(tabId);
    const tind = tabInfo.findIndex((tab) => tab.id === tabId);
    if (tabInfo[tind].hasOpenerId) {
        const openerId = tabInfo[tind].openerId;
        const oind = tabInfo.findIndex((tab) => tab.id === openerId);
    }
    // syncTabsfromInfo();
    // console.log({ allTabStates });
    console.log({ tabInfo });
    // console.log({ tabIdList });
    // console.log({ updatedTabIdList });
    // console.log({ childTabIdList });
    // console.log({ removedTabIdList });
    // console.log({ replacedTabIdList });
});
const syncTabInfo = (id) => {
    const ind = tabInfo.findIndex((tab) => tab.id === id);
    if (ind !== -1) {
        if (tabInfo[ind].changeLog.url.length !== 0) {
            tabInfo[ind].url = tabInfo[ind].changeLog.url.at(-1);
        }
        if (tabInfo[ind].changeLog.title.length !== 0) {
            tabInfo[ind].title = tabInfo[ind].changeLog.title.at(-1);
        }
    }
    globalTabState = tabInfo;
    (0,_utils_storage__WEBPACK_IMPORTED_MODULE_0__.setTabStates)(globalTabState);
};

})();

/******/ })()
;
//# sourceMappingURL=background.js.map