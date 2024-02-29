import React, { useEffect, useState } from "react";
import "./App.css";
import UpdatedTabs from "./tabs";
import { getTabStates } from "../utils/storage";
import { TabInfo } from "../utils/schema";

const App = () => {
  const [state, setState] = useState<TabInfo[]>([]);

  useEffect(() => {
    getTabStates().then((tabs) => setState(tabs));
  }, [state]);
  return (
    <div>
      <UpdatedTabs />
      {state?.map((tab) => (
        <p key={tab.id}>
          {tab.type} ----
          {tab.id} -----
          {tab.url}
        </p>
      ))}
    </div>
  );
};

export default App;
