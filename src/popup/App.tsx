import React, { useEffect, useState } from "react";
import "./App.css";
import UpdatedTabs from "./tabs";
import { getTabStates } from "../utils/storage";
import { TabInfo, TabsTree } from "../utils/schema";

const App = () => {
  const [state, setState] = useState<TabsTree>([]);
  // const [statusChanges,setStatusChanges] = useState<number>(0)

  

  useEffect(() => {
    getTabStates().then((tabs) => setState(tabs));

  }, []);


  const updateHandler = () => {
    getTabStates().then((tabs) => setState(tabs));
  }

  console.log(state)
  // const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
  //   // console.log({changes})
  //   if (changes.tabStates) {
  //     console.log("updating")
  //     // setStatusChanges(prev => prev+1)
  //     const newState = changes.tabStates.newValue;
  //     // console.log(newState)
  //     setState(newState || []);
  //     console.log({state})

  //     // console.log({statusChanges})

  //   }
  // };
  // chrome.storage.onChanged.addListener(handleStorageChange);
  return (
    <div>
      <button onClick={updateHandler}>Update</button>
      <UpdatedTabs data={ state} />
      {/* {
        state?.map(node => {
          return (
            node.node.map(tab => {
              return (
                <p key={tab.globalIndex} >{tab.title}</p>
              )
            })
          )
        })
     } */}
    </div>
  );
};

export default App;
