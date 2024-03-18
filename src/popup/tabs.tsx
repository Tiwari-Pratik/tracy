import React from "react";
import TabNode from "../components/tabnode";
import "./tabs.css";
import Connector from "../components/connector";
import TestList from "../components/text";
import { TabsTree } from "../utils/schema";

interface Props {
  data: TabsTree
}
const UpdatedTabs = ({data}:Props) => {

  return (
    <div className="tabList">
      <TestList data={data} />
      {/* <p>Tree</p> */}
    </div>
  );
};

export default UpdatedTabs;
