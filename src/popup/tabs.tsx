import React from "react";
import { TabHistoryItem } from "../background/background";
interface PopupProps {
  tabHistory: TabHistoryItem[];
}

const UpdatedTabs: React.FC<PopupProps> = ({ tabHistory }) => {
  return <div>Tabs</div>;
};

export default UpdatedTabs;
