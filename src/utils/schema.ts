export type TabIdList = number[];
export type ChildTabIdList = number[];
export type RemovedTabIdList = number[];


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


export type TabsTree = TreeNode[];
