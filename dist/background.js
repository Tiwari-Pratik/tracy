/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**************************************!*\
  !*** ./src/background/background.ts ***!
  \**************************************/
let existingTabId = null;
chrome.action.onClicked.addListener(function (tab) {
    if (existingTabId) {
        // If the tab is already open, switch to it
        chrome.tabs.update(existingTabId, { active: true });
    }
    else {
        // If the tab is not open, create a new one
        chrome.tabs.create({ url: "popup.html" }, function (newTab) {
            existingTabId = newTab.id;
        });
    }
});
let tabInfo = [];
let tabIdList = [];
let childTabIdList = [];
let updatedTabIdList = [];
let removedTabIdList = [];
let replacedTabIdList = [];
// adding all the opened tabs for the first time
chrome.tabs.query({}, function (tabs) {
    tabs.forEach((tab) => {
        tabIdList.push(tab.id);
        tabInfo.push({
            type: "existing",
            id: tab.id,
            url: tab.url,
            title: tab.title,
            childId: [],
            changeLog: { url: [], title: [], id: [] },
        });
    });
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
    tabInfo.push({
        type: "created",
        id: newTab.id,
        childId: [],
        changeLog: { url: [], title: [], id: [] },
    });
    if (newTab.openerTabId) {
        childTabIdList.push(newTab.id);
        const ind = tabInfo.findIndex((tab) => tab.id === newTab.openerTabId);
        tabInfo[ind].childId.push(newTab.id);
        tabInfo[ind].type = "child added";
    }
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
    console.log({ tabInfo });
    // console.log({ tabIdList });
    // console.log({ updatedTabIdList });
    // console.log({ childTabIdList });
    // console.log({ removedTabIdList });
    // console.log({ replacedTabIdList });
});
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
};

/******/ })()
;
//# sourceMappingURL=background.js.map