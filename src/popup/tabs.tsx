import React from "react";
import TabNode from "../components/tabnode";
import "./tabs.css";
import Connector from "../components/connector";
import TestList from "../components/text";

const UpdatedTabs: React.FC = () => {
  const data = [
    {
      urls: ["url1", "url2"],
      titles: ["title1", "title2"],
      children: [
        {
          urls: ["url3", "url4"],
          titles: ["title3", "title4"],
        },
        {
          urls: ["url5", "url6"],
          titles: ["title5", "title6"],
        },
      ],
    },
    {
      urls: ["url1"],
      titles: ["title1"],
      children: [
        {
          urls: ["url3", "url4"],
          titles: ["title3", "title4"],
        },
        {
          urls: ["url5"],
          titles: ["title5"],
        },
      ],
    },
  ];
  return (
    <div className="tabList">
      <TestList />
    </div>
  );
};

export default UpdatedTabs;
