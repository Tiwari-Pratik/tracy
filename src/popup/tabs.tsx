import React from "react";
import TabNode from "../components/tabnode";
import "./tabs.css";
import Connector from "../components/connector";
import TestList from "../components/text";
import { TabsTree } from "../utils/schema";

interface Props {
  data: TabsTree,
  date:string
}
const UpdatedTabs = ({ data,date }: Props) => {
  
  // const date = new Date().toDateString()

  return (
    <div className="tabList">
      <h2>Date: {date}</h2>
      <TestList data={data} />
      {/* <p>Tree</p> */}
    </div>
  );
};

export default UpdatedTabs;
