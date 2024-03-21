import React, { Fragment, MouseEvent } from "react";
import "./test.css";
import { TabNode, TabsTree } from "../utils/schema";

interface Props {
  data:TabsTree
}
const TestList = ({data}:Props) => {
 
  let mykey = 0

  function generateNestedList(nodes: TabNode[]): JSX.Element {


    function switchToTabOrOpenNew(url) {
      chrome.tabs.query({}, function(tabs) {
          // Check if any tab has the given URL
          let tabExists = tabs.some(function(tab) {
              return tab.url === url;
          });
  
          if (tabExists) {
              // Switch to the existing tab with the given URL
              let existingTab = tabs.find(function(tab) {
                  return tab.url === url;
              });
              chrome.tabs.update(existingTab.id, { active: true });
          } else {
              // Open a new tab with the given URL
              chrome.tabs.create({ url: url });
          }
      });
    }
    
    const linkClickHandler = (event: MouseEvent) => {
      event.preventDefault();

      // console.log(event.currentTarget)
      if (event.currentTarget instanceof HTMLAnchorElement) {

        const linkEl = event.currentTarget as HTMLAnchorElement
        const url = linkEl.href
        console.log(url)
        if (url) {
          switchToTabOrOpenNew(url)
        }
      }

    }

    console.log(mykey)

    return (
      <ul className="ul" key={++mykey}>
        {nodes.map((node, index) => (
          <Fragment key={++mykey}>
            {node.isFirstChild && (
              <li className="li" key={++mykey}>
                <div key={++mykey}>
                  <div className="childConnector" key={++mykey}></div>
                </div>
              </li>
            )}
            {node.hasPrevious && !node.isFirstChild && (
              <li key={++mykey} className="li">
                <div key={++mykey}>
                  <div className="seperator" key={++mykey}></div>
                </div>
              </li>
            )}
            <li key={++mykey} className="li">
              <div key={++mykey}>
                <a href={node.url} onClick={linkClickHandler} className="anchor">
                <p key={node.globalIndex} className={node.type === "removed"?"paragraph removed": "paragraph"}>{node.url.split("://")[1]}</p>
                </a>
                
              </div>
              {node.hasChild && node.child && node.child.map(cnode => generateNestedList(cnode.node))}
            </li>
          </Fragment>
        ))}
      </ul>
    );
  }

  function generateHTML(tree: TabsTree): JSX.Element {
    return (
      <>
        {tree?.map((treeNode, index) => (
          <div key={`div-${++mykey}`}>{generateNestedList(treeNode?.node)}</div>
        ))}
      </>
    );
  }

  // Call the generateHTML function with your data
  const jsxOutput = generateHTML(data);

  return (
    <div className="container-list">
      {jsxOutput}
    </div>
  );
};

export default TestList;
