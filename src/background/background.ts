import {
  ChildTabIdList,
  RemovedTabIdList,
  TabIdList,
  TabInfo,
  TabNodes,
} from "../utils/schema";
import { setTabStates } from "../utils/storage";

let existingTabId = null;

chrome.runtime.onInstalled.addListener((event) => {
  setTabStates([]);
});

chrome.action.onClicked.addListener(function (tab) {
  if (existingTabId) {
    chrome.tabs.get(existingTabId, function (tab) {
      if (chrome.runtime.lastError) {
        chrome.tabs.create({ url: "popup.html" }, function (newTab) {
          existingTabId = newTab.id;
        });
      } else {
        // If the tab is already open, switch to it
        chrome.tabs.update(existingTabId, { active: true });
      }
    });
  } else {
    // If the tab is not open, create a new one
    chrome.tabs.create({ url: "popup.html" }, function (newTab) {
      existingTabId = newTab.id;
    });
  }
});

let tabInfo: TabInfo[] = [];
let globalTabState: TabInfo[] = [];
let tabSyncState: TabNodes[] = [];
let tabIdList: TabIdList = [];
let childTabIdList: ChildTabIdList = [];
let removedTabIdList: RemovedTabIdList = [];
let allTabStates: Omit<TabNodes, "childNodes">[] = [];

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

// adding all the opened tabs for the first time
chrome.tabs.query({}, function (tabs: chrome.tabs.Tab[]) {
  tabs.forEach((tab) => {
    tabIdList.push(tab.id);
    tabInfo.push({
      type: "existing",
      id: tab.id,
      index: tab.index,
      url: tab.url,
      title: tab.title,
      childId: [],
      changeLog: { url: [], title: [], id: [] },
    });
    allTabStates.push({
      urls: [tab.url],
      titles: [tab.title],
      type: "existing",
      tabId: tab.id,
    });
  });
  globalTabState = tabInfo;
  setTabStates(globalTabState);

  console.log({ allTabStates });
  console.log({ tabInfo });
  // console.log({ tabIdList });
  // console.log({ updatedTabIdList });
  // console.log({ childTabIdList });
  // console.log({ removedTabIdList });
  // console.log({ replacedTabIdList });
});

const syncTabsfromInfo = () => {
  tabInfo.forEach((tab) => {
    const ind = allTabStates.findIndex((tabS) => tabS.tabId === tab.id);
    if (ind !== -1) {
      if (tab.type === "removed") {
        //do something
        allTabStates[ind].type = "removed";
      } else if (tab.url !== allTabStates[ind].urls.at(-1)) {
        allTabStates[ind].urls.push(tab.url);
      } else if (tab.title !== allTabStates[ind].titles.at(-1)) {
        allTabStates[ind].titles.push(tab.title);
      }
    } else {
      allTabStates.push({
        urls: [tab.url],
        titles: [tab.title],
        type: tab.type,
        tabId: tab.id,
      });
    }
  });
};

// tracking when a new tab is created
chrome.tabs.onCreated.addListener((newTab: chrome.tabs.Tab) => {
  tabIdList.push(newTab.id);
  tabInfo.push({
    type: "created",
    id: newTab.id,
    index: newTab.index,
    childId: [],
    changeLog: { url: [], title: [], id: [] },
  });
  if (newTab.openerTabId) {
    childTabIdList.push(newTab.id);
    const ind = tabInfo.findIndex((tab) => tab.id === newTab.openerTabId);
    tabInfo[ind].childId.push(newTab.id);
    tabInfo[ind].type = "child added";
  }
  globalTabState = tabInfo;
  setTabStates(globalTabState);
  // syncTabsfromInfo();
  // console.log({ allTabStates });
  // console.log({ tabInfo });
  // console.log({ tabIdList });
  // console.log({ updatedTabIdList });
  // console.log({ childTabIdList });
  // console.log({ removedTabIdList });
  // console.log({ replacedTabIdList });
});

//tracking when a tab is deleted
chrome.tabs.onRemoved.addListener((tabId: number) => {
  removedTabIdList.push(tabId);
  const ind = tabInfo.findIndex((tab) => tab.id === tabId);
  tabInfo[ind].type = "removed";

  globalTabState = tabInfo;
  setTabStates(globalTabState);
  syncTabsfromInfo();
  console.log({ allTabStates });
  // console.log({ tabInfo });
  // console.log({ tabIdList });
  // console.log({ updatedTabIdList });
  // console.log({ childTabIdList });
  // console.log({ removedTabIdList });
  // console.log({ replacedTabIdList });
});

// tracking all the tab updates
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // console.log({ changeInfo });

  const ind = tabInfo.findIndex((tab) => tab.id === tabId);
  if (ind !== -1) {
    if (tabInfo[ind].changeLog) {
      tabInfo[ind].type = "updated";
    }
    tabInfo[ind].changeLog.id?.push(tabId);
    if (changeInfo.url) {
      tabInfo[ind].changeLog.url?.push(changeInfo.url);
    }
    if (changeInfo.title) {
      tabInfo[ind].changeLog.title?.push(changeInfo.title);
    }
  }
  syncTabInfo(tabId);
  syncTabsfromInfo();
  console.log({ allTabStates });
  // console.log({ tabInfo });
  // console.log({ tabIdList });
  // console.log({ updatedTabIdList });
  // console.log({ childTabIdList });
  // console.log({ removedTabIdList });
  // console.log({ replacedTabIdList });
});

const syncTabInfo = (id: number) => {
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
  setTabStates(globalTabState);
};
