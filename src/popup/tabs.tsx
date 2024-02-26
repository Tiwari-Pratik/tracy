import React from "react";
import { TabHistoryItem } from "../background/background";
interface PopupProps {
  tabHistory: TabHistoryItem[];
}

const UpdatedTabs: React.FC<PopupProps> = ({ tabHistory }) => {
  return (
    <div>
      <ul>
        {tabHistory.map((item, index) => (
          <li key={index}>
            Tab {index + 1}: {item.type} - ID: {item.tab.id}, Title:{" "}
            {item.tab.title} - openerTab: {item.tab.openerTabId}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpdatedTabs;
