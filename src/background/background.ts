import {
  ChildTabIdList,
  RemovedTabIdList,
  TabIdList,
  TabInfo,
  TabNode,
  TabNodes,
  TabsTree,
  TreeNode,
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
// let tabSyncState: TabNodes[] = [];
let tabIdList: TabIdList = [];
let childTabIdList: ChildTabIdList = [];
let removedTabIdList: RemovedTabIdList = [];
// let allTabStates: Omit<TabNodes, "childNodes">[] = [];
let historyStates: TabsTree = [];
let globalIndex: number = 0;

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
    const nodeData: TabNode = {
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

function traverseAndUpdateById(
  tree: TabsTree,
  targetId: number,
  updateFn: (node: TabNode) => void,
): boolean {
  let nodeFound = false;

  function traverse(nodes: TabNode[]): void {
    for (const node of nodes) {
      if (node.id === targetId) {
        // Update the properties using the provided update function
        updateFn(node);
        nodeFound = true;
        return;
      }

      if (node.hasChild && node.child) {
        traverse(node.child);
      }
    }
  }

  for (const treeNode of tree) {
    traverse(treeNode.node);
  }

  return nodeFound;
}
const syncStateFromId = (id: number) => {
  const ind = tabInfo.findIndex((tab) => tab.id === id);
  if (!tabInfo[ind].hasOpenerId) {
    const nodeData: TabNode = {
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
  } else {
  }
};
// adding all the opened tabs for the first time
chrome.tabs.query({}, function (tabs: chrome.tabs.Tab[]) {
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
  setTabStates(globalTabState);

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
  setTabStates(globalTabState);

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
chrome.tabs.onRemoved.addListener((tabId: number) => {
  removedTabIdList.push(tabId);
  const ind = tabInfo.findIndex((tab) => tab.id === tabId);
  tabInfo[ind].type = "removed";

  globalTabState = tabInfo;
  setTabStates(globalTabState);
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
