chrome.action.onClicked.addListener(function(tab) {
  chrome.tabs.create({
    url: chrome.runtime.getURL("popup.html"),
    active: true,
  });
});

export interface TabHistoryItem {
  type: string;
  tab: chrome.tabs.Tab;
}

let tabHistory: TabHistoryItem[] = [];

function updatePopup() {
  // Send tab history to popup script
  chrome.runtime.sendMessage(
    {
      action: "update",
      tabHistory: tabHistory,
    },
    function(response) {
      console.log(response);
    },
  );
}

chrome.tabs.query({}, function(tabs) {
  // On extension startup, include all existing tabs
  tabHistory = tabs.map((tab) => ({ type: "existing", tab }));
  updatePopup();
});

chrome.tabs.onCreated.addListener(function(newTab: chrome.tabs.Tab) {
  // tabHistory.push({ type: "created", tab });
  // updatePopup();

  tabHistory.push({ type: "created", tab: newTab });
  updatePopup();
});

chrome.tabs.onUpdated.addListener(function(
  tabId: number,
  changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab,
) {
  const index = tabHistory.findIndex((item) => item.tab.id === tabId);

  if (index !== -1) {
    // If tab already exists in history, update it
    tabHistory[index] = { type: "updated", tab };
  } else {
    // If tab is not in history, add it as an existing tab
    tabHistory.push({ type: "existing", tab });
  }

  updatePopup();
});
