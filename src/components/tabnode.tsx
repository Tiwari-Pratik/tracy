import React from "react";
import "./tabnode.css";
interface Props {
  url: string;
  title: string;
}
const TabNode = ({ url, title }: Props) => {
  return (
    <div className="node">
      <a href="#" className="link">
        {title}
      </a>
    </div>
  );
};

export default TabNode;
