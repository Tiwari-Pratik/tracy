import { TabInfo } from "./schema";

export interface LocalTabState {
  tabStates: TabInfo[];
}
//
// type LocalTabState = Record<string,TabInfo[][]>

export type LocalTabSatteKeys = keyof LocalTabState;

export const setTabStates = (tabsInfoData: TabInfo[]): Promise<void> => {
  // let existingState: TabInfo[][] = [];
  // getTabStates().then((tabsArray) => {
  //   existingState = tabsArray;
  // });
  // if (existingState.length !== 0) {
  //   existingState.push(tabsInfoData);
  // }
  const vals: LocalTabState = {
    tabStates: tabsInfoData,
  };
  return new Promise((resolve) => {
    chrome.storage.local.set(vals, () => resolve());
    // chrome.runtime.sendMessage({ action: "update" });
  });
};

export const getTabStates = (): Promise<TabInfo[]> => {
  const keys: LocalTabSatteKeys[] = ["tabStates"];
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, (res: LocalTabState) => {
      resolve(res.tabStates ?? []);
    });
  });
};
