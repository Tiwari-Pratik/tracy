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
}
