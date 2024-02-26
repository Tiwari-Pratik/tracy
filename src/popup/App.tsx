import React, { useEffect, useState } from "react";
import "./App.css";
import UpdatedTabs from "./tabs";
import { TabHistoryItem } from "../background/background";

interface PopupAppState {
  tabHistory: TabHistoryItem[];
}
const App = () => {
  const [popupState, setPopupState] = useState<PopupAppState>({
    tabHistory: [],
  });

  useEffect(() => {
    chrome.runtime.onMessage.addListener(
      (request: { action: string; tabHistory: TabHistoryItem[] }) => {
        if (request.action === "update") {
          setPopupState({ tabHistory: request.tabHistory });
        }
      },
    );
  }, []);

  return <UpdatedTabs tabHistory={popupState.tabHistory} />;
};

export default App;
