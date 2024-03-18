import {
  ChildTabIdList,
  RemovedTabIdList,
  TabIdList,
  TabInfo,
  TabNode,
  TabsTree,
  TreeNode,
  NodeWithPath,
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
// let globalTabState: TabInfo[] = [];
let globalTabState: TabsTree = [];

let tabIdList: TabIdList = [];
let childTabIdList: ChildTabIdList = [];
let removedTabIdList: RemovedTabIdList = [];
let historyStates: TabsTree = [];
let globalIndex: number = 0;

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

function findParentArrayAndUpdate(
  tree: TabsTree,
  gindex: number,
  newNode: TabNode,
  ind: number,
): void {
  function traverse(nodes: TabNode[], parentPath: TreeNode[]): void {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      if (node.globalIndex === gindex) {
        if (node.url === newNode.url) {
          return;
        }
        globalIndex += 1;
        tabInfo[ind].globalIndex = globalIndex;
        newNode.globalIndex = globalIndex;
        // Found the target node, update its parent's node array with the new node
        const parent = parentPath[parentPath.length - 1];
        parent.node.push(newNode);
        return;
      }

      if (node.hasChild && node.child) {
        for (const cnode of node.child) {
          traverse(cnode.node, [...parentPath, cnode]);
        }
        // traverse(node.child, [...parentPath, { node }]); // Add the current node to the path
      }
    }
  }

  for (const treeNode of tree) {
    traverse(treeNode.node, [treeNode]);
  }
}

function traverseAndUpdateByGlobalIndex(
  tree: TabsTree,
  gindex: number,
  updateFn: (node: TabNode) => void,
): boolean {
  let nodeFound = false;

  function traverse(nodes: TabNode[]): void {
    for (const node of nodes) {
      if (node.globalIndex === gindex) {
        // Update the properties using the provided update function
        updateFn(node);
        nodeFound = true;
        return;
      }

      if (node.hasChild && node.child) {
        for (const Cnode of node.child) traverse(Cnode.node);
      }
    }
  }

  for (const treeNode of tree) {
    traverse(treeNode.node);
  }

  return nodeFound;
}


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
  // globalTabState = tabInfo;
  globalTabState = historyStates;

  syncStatesFirstTime();
  setTabStates(globalTabState);

  // console.log({ tabInfo });
  // console.log({ historyStates });
  // console.log({ tabIdList });
  // console.log({ updatedTabIdList });
  // console.log({ childTabIdList });
  // console.log({ removedTabIdList });
  // console.log({ replacedTabIdList });
});

// tracking when a new tab is created
chrome.tabs.onCreated.addListener((newTab: chrome.tabs.Tab) => {
  tabIdList.push(newTab.id);
  globalIndex += 1;
  tabInfo.push({
    type: "created",
    id: newTab.id,
    title: newTab.title,
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
    tabInfo[cind].hasOpenerId = true;
    tabInfo[cind].openerId = newTab.openerTabId;
  }
  // globalTabState = tabInfo;


  if (!newTab.openerTabId) {
    const nodeData: TabNode = {
      type: "created",
      url: newTab.url,
      hasPrevious: false,
      hasChild: false,
      title: newTab.title,
      id: newTab.id,
      globalIndex: globalIndex,
    };

    const nodeInfo = [nodeData];
    historyStates.push({
      node: nodeInfo,
    });
  } else {
    const gindex = tabInfo.findIndex((tab) => tab.id === newTab.openerTabId);
    const newTabGindex = tabInfo[gindex].globalIndex;
    traverseAndUpdateByGlobalIndex(historyStates, newTabGindex, (node) => {
      if (!node.hasChild) {
        const nodeData: TabNode = {
          type: "created",
          url: newTab.url,
          hasPrevious: false,
          hasChild: false,
          title: newTab.title,
          id: newTab.id,
          globalIndex: globalIndex,
          isFirstChild:true
        };
        node.child = [
          {
            node: [nodeData],
          },
        ];
        node.hasChild = true;
        node.type = "updated";
      } else {
        const nodeData: TabNode = {
          type: "created",
          url: newTab.url,
          hasPrevious: true,
          hasChild: false,
          title: newTab.title,
          id: newTab.id,
          globalIndex: globalIndex,
        };
        node.child.push({
          node: [nodeData],
        });
        node.type = "updated";
      }
    });
  }
  globalTabState = historyStates;
  setTabStates(globalTabState);

  // console.log({ tabInfo });
  // console.log({ historyStates });
});

//tracking when a tab is deleted
chrome.tabs.onRemoved.addListener((tabId: number) => {
  removedTabIdList.push(tabId);
  const ind = tabInfo.findIndex((tab) => tab.id === tabId);
  tabInfo[ind].type = "removed";

  // globalTabState = tabInfo;
  

  const gindex = tabInfo[ind].globalIndex;
  traverseAndUpdateByGlobalIndex(historyStates, gindex, (node) => {
    node.type = "removed";
  });

  globalTabState = historyStates;
  setTabStates(globalTabState);
  // console.log({ tabInfo });
  // console.log({ historyStates });
});

// tracking all the tab updates
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // console.log({ changeInfo });
  //
  // console.log(tab.status);
  // console.log(tab.active);

  const ind = tabInfo.findIndex((tab) => tab.id === tabId);
  if (ind !== -1) {
    if (tabInfo[ind].type === "created") {
      tabInfo[ind].changeLog.id?.push(tabId);
      if (changeInfo.url) {
        tabInfo[ind].changeLog.url?.push(changeInfo.url);
      }
      if (changeInfo.title) {
        tabInfo[ind].changeLog.title?.push(changeInfo.title);
      }
      syncTabInfo(tabId);
      if (tab.status === "complete") {
        tabInfo[ind].type = "updated";
      }

      // if (tabInfo[ind].changeLog) {
      //   tabInfo[ind].type = "updated";
      // }
    } else if (tabInfo[ind].type !== "removed") {
      tabInfo[ind].changeLog.id?.push(tabId);
      if (changeInfo.url) {
        tabInfo[ind].changeLog.url?.push(changeInfo.url);
      }
      if (changeInfo.title) {
        tabInfo[ind].changeLog.title?.push(changeInfo.title);
      }
      updateTabInfo(tabId);
      if (tab.status === "complete") {
        tabInfo[ind].type = "updated";
        const gindex = tabInfo[ind].globalIndex;
        const nodeData: TabNode = {
          type: "updated",
          url: tabInfo[ind].url,
          hasPrevious: true,
          hasChild: false,
          title: tabInfo[ind].title,
          id: tabInfo[ind].id,
          globalIndex: gindex,
        };
        findParentArrayAndUpdate(historyStates, gindex, nodeData, ind);
      }
    }
  }

  // globalTabState = tabInfo;
  globalTabState = historyStates;

  setTabStates(globalTabState);
  // console.log({ tabInfo });
  // console.log({ historyStates });
});

const syncTabInfo = (id: number) => {
  const ind = tabInfo.findIndex((tab) => tab.id === id);
  const gindex = tabInfo[ind].globalIndex;
  if (ind !== -1) {
    if (tabInfo[ind].changeLog.url.length !== 0) {
      tabInfo[ind].url = tabInfo[ind].changeLog.url.at(-1);
      traverseAndUpdateByGlobalIndex(historyStates, gindex, (node) => {
        node.url = tabInfo[ind].url;
        node.type = "updated";
      });
    }
    if (tabInfo[ind].changeLog.title.length !== 0) {
      tabInfo[ind].title = tabInfo[ind].changeLog.title.at(-1);
      traverseAndUpdateByGlobalIndex(historyStates, gindex, (node) => {
        node.title = tabInfo[ind].title;
      });
    }
  }
};

const updateTabInfo = (id: number) => {
  const ind = tabInfo.findIndex((tab) => tab.id === id);
  const gindex = tabInfo[ind].globalIndex;
  if (ind !== -1) {
    if (tabInfo[ind].changeLog.url.length !== 0) {
      tabInfo[ind].url = tabInfo[ind].changeLog.url.at(-1);
    }
    if (tabInfo[ind].changeLog.title.length !== 0) {
      tabInfo[ind].title = tabInfo[ind].changeLog.title.at(-1);
    }
  }
};
