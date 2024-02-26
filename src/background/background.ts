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

export type Tab = Pick<
  chrome.tabs.Tab,
  | "id"
  | "url"
  | "index"
  | "title"
  | "sessionId"
  | "openerTabId"
  | "lastAccessed"
>;
export interface TabHistoryItem {
  type: string;
  // tab: Tab;
  id: number;
  url: string;
  title: string;
  index: number;
  parentId?: number;
  parent?: {
    url?: string;
    title?: string;
    index?: number;
  };
  previousId?: number;
  previous?: {
    url?: string;
    title?: string;
    index?: number;
  };
}

let tabHistory: TabHistoryItem[] = [];

// adding all the opened tabs for the first time
chrome.tabs.query({}, function (tabs: chrome.tabs.Tab[]) {
  tabs.forEach((tab) => {
    tabHistory.push({
      type: "existing",
      id: tab.id,
      index: tab.index,
      url: tab.url,
      title: tab.title,
    });
  });
});

// tracking when a new tab is created
chrome.tabs.onCreated.addListener((tab: chrome.tabs.Tab) => {
  let parentUrl = "";
  let parentTitle = "";
  let parentIndex = null;
  if (tab.openerTabId) {
    chrome.tabs.get(tab.openerTabId, function (oldTab) {
      const ind = tabHistory.findIndex((tab) => tab.id === oldTab.id);
      if (ind !== -1) {
        parentIndex = ind;
      }
      parentUrl = oldTab.url;
      parentTitle = oldTab.title;
    });
  }
  tabHistory.push({
    type: "created",
    id: tab.id,
    index: tab.index,
    url: tab.url,
    title: tab.title,
    parentId: tab.openerTabId,
    parent: {
      url: parentUrl,
      title: parentTitle,
      index: parentIndex,
    },
  });
  console.log(tabHistory);
});

//tracking when a tab is deleted
chrome.tabs.onRemoved.addListener((tabId: number) => {
  const removedIndex = tabHistory.findIndex((tab) => tab.id === tabId);

  tabHistory[removedIndex].type = "removed";
  console.log(tabHistory);
});

//tracking when a tab is replaced
chrome.tabs.onReplaced.addListener(
  (addedTabId: number, removedTabId: number) => {
    let previousTabUrl = "";
    let previousTabTitle = "";
    let previousTabindex = null;
    chrome.tabs.get(removedTabId, (oldTab) => {
      previousTabTitle = oldTab.title;
      previousTabUrl = oldTab.url;

      const ind = tabHistory.findIndex((tab) => tab.id === oldTab.id);
      if (ind !== -1) {
        previousTabindex = ind;
      }
    });

    let newTabUrl = "";
    let newTabTitle = "";
    let newTabindex = null;
    chrome.tabs.get(addedTabId, (newTab) => {
      newTabTitle = newTab.title;
      newTabUrl = newTab.url;

      const ind = tabHistory.findIndex((tab) => tab.id === newTab.id);
      if (ind !== -1) {
        newTabindex = ind;
      }
    });

    tabHistory.push({
      type: "replaced",
      id: addedTabId,
      index: newTabindex,
      url: newTabUrl,
      title: newTabTitle,
      previousId: removedTabId,
      previous: {
        url: previousTabUrl,
        title: previousTabTitle,
        index: previousTabindex,
      },
    });
    console.log(tabHistory);
  },
);
