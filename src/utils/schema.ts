export type TabIdList = number[];
export type ChildTabIdList = number[];
export type RemovedTabIdList = number[];

export interface OriginalTabInfo {
  id: number;
  index: number;
  url: string;
  title: string;
}
export interface ChangeInfo {
  url: string[];
  title: string[];
  id: number[];
}
export interface TabInfo {
  type: string;
  id: number;
  childId: number[];
  changeLog?: ChangeInfo;
  url?: string;
  title?: string;
  index: number;
  hasOpenerId: boolean;
  openerId?: number;
  globalIndex: number;
}

export interface TabNodes {
  urls: string[];
  type: string;
  titles: string[];
  childNodes: TabNodes[];
  tabId: number;
}

export type TabNode = {
  id: number;
  url: string;
  type: string;
  title: string;
  hasPrevious: boolean;
  hasChild: boolean;
  child?: TreeNode[];
  isFirstChild?: boolean;
  globalIndex: number;
};

export type TreeNode = {
  node: TabNode[];
};

export interface NodeWithPath {
  node: TabNode;
  path: TreeNode[];
}

export type TabsTree = TreeNode[];
