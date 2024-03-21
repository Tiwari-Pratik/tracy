import { TabInfo, TabsTree } from "./schema";

// export interface LocalTabState {
//   tabStates: TabInfo[];
// }

export interface StatesData {
  date: string;
  tabStates: TabsTree
}

export type FinalGlobalState = Array<StatesData>

export interface GlobalTabStates {
  allStates: FinalGlobalState
}

export interface LocalTabStateNew {
  tabStates: TabsTree
}

// export type LocalTabSatteKeys = keyof LocalTabState;
export type LocalTabStateKeysNew = keyof LocalTabStateNew;
export type GlobalTabStateKeys = keyof GlobalTabStates;




export const setTabStates = (tabsInfoData: TabsTree): Promise<void> => {

  const vals: LocalTabStateNew = {
    tabStates: tabsInfoData,
  };
  return new Promise((resolve) => {
    chrome.storage.local.set(vals, () => resolve());
    // chrome.runtime.sendMessage({ action: "update" });
  });
};



export const getTabStates = (): Promise<TabsTree> => {
  const keys: LocalTabStateKeysNew[] = ["tabStates"];
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, (res: LocalTabStateNew) => {
      resolve(res.tabStates ?? []);
    });
  });
};


export const setGlobalTabStates = (tabsInfoDataArray: FinalGlobalState): Promise<void> => {

  const vals: GlobalTabStates = {
    allStates: tabsInfoDataArray
  };
  return new Promise((resolve) => {
    chrome.storage.local.set(vals, () => resolve());
    // chrome.runtime.sendMessage({ action: "update" });
  });
};

const dateOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

export const getGlobalTabStates = (): Promise<FinalGlobalState> => {
  const keys: GlobalTabStateKeys[] = ["allStates"];
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, (res: GlobalTabStates) => {
      resolve(res.allStates ?? [{
        date: new Date().toDateString() + " " + new Date().toLocaleTimeString(),
        tabStates:[]
      }]);
    });
  });
};

