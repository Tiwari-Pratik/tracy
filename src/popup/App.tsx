import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import UpdatedTabs from "./tabs";
import { FinalGlobalState, getGlobalTabStates, getTabStates } from "../utils/storage";
import { TabInfo, TabsTree } from "../utils/schema";

const App = () => {
  const [state, setState] = useState<TabsTree>([]);
  const [globalState,setGlobalState] = useState<FinalGlobalState>([{date:new Date().toDateString(),tabStates:[]}])

  useEffect(() => {
    getTabStates().then((tabs) => setState(tabs));
    getGlobalTabStates().then(allTabStates => setGlobalState(allTabStates))

  //   const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
  //     // console.log({changes})
  //     if (changes.tabStates) {

  //       const newState = changes.tabStates.newValue;

  //       setState(newState || []);
  
  //     }
  //   };
  // chrome.storage.onChanged.addListener(handleStorageChange);
  
  // return () => {
  //   // Clean up the listener when component unmounts
  //   chrome.storage.onChanged.removeListener(handleStorageChange);
  // };

  }, []);

  const reversedGlobalState = useMemo(() => {
    const globalStateCopy = globalState.slice()
    return globalStateCopy.reverse()
  },[globalState])


  const updateHandler = () => {
    getTabStates().then((tabs) => setState(tabs));
    getGlobalTabStates().then(allTabStates => setGlobalState(allTabStates))

  }

  console.log({state})
  console.log({globalState})
  
  return (
    <div>
      <button onClick={updateHandler} className="update-button">Update</button>
      {
        reversedGlobalState.map((stateData,index) => {
          return (
            <UpdatedTabs data={stateData?.tabStates} date={stateData?.date } key={`tabs-${index}`} />
          )
        })
      }
      {/* <UpdatedTabs data={globalState.at(-1)?.tabStates} date={globalState.at(-1)?.date } /> */}
    </div>
  );
};

export default App;
