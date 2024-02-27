let existingTabId = null;

chrome.action.onClicked.addListener(function (tab) {
  if (existingTabId) {
    // If the tab is already open, switch to it
    chrome.tabs.update(existingTabId, { active: true });
  } else {
    // If the tab is not open, create a new one
    chrome.tabs.create({ url: "popup.html" }, function (newTab) {
      existingTabId = newTab.id;
    });
  }
});

type TabIdList = number[];
type ChildTabIdList = number[];
type UpdatedTabIdList = number[];
type RemovedTabIdList = number[];
type ReplacedTabIdList = number[];

interface ChangeInfo {
  url: string[];
  title: string[];
  id: number[];
}
interface TabInfo {
  type: string;
  id: number;
  childId: number[];
  changeLog?: ChangeInfo;
  url?: string;
  title?: string;
}

let tabInfo: TabInfo[] = [];
let tabIdList: TabIdList = [];
let childTabIdList: ChildTabIdList = [];
let updatedTabIdList: UpdatedTabIdList = [];
let removedTabIdList: RemovedTabIdList = [];
let replacedTabIdList: ReplacedTabIdList = [];

// adding all the opened tabs for the first time
chrome.tabs.query({}, function (tabs: chrome.tabs.Tab[]) {
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
chrome.tabs.onCreated.addListener((newTab: chrome.tabs.Tab) => {
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
chrome.tabs.onRemoved.addListener((tabId: number) => {
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
  console.log({ tabInfo });
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
};
