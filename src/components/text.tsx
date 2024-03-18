import React, { Fragment } from "react";
import "./test.css";
import { TabNode, TabsTree } from "../utils/schema";

interface Props {
  data:TabsTree
}
const TestList = ({data}:Props) => {
  // type Node = {
  //   url: string;
  //   title: string;
  //   hasPrevious: boolean;
  //   hasChild: boolean;
  //   child?: TreeNode[];
  //   isFirstChild?: boolean;
  // };

  // type TreeNode = {
  //   node: Node[];
  // };

  // type Tree = TreeNode[];

//   const customData: Tree = [
//     {
//       node: [
//         {
//           url: "url1",
//           title: "title1",
//           hasPrevious: false,
//           hasChild: false,
//         },
//         {
//           url: "url2",
//           title: "title2",
//           hasPrevious: true,
//           hasChild: true,
//           child: [
//             {
//               node: [

//                 {
//                   url: "child1",
//                   title: "childtitle1",
//                   hasPrevious: false,
//                   hasChild: false,
//                   isFirstChild: true,
//                 },
            
//           ]
//         }
           
//           ],
//         },
//       ],
//     },
//     {
//       node: [
//         {
//           url: "url3",
//           title: "title3",
//           hasPrevious: false,
//           hasChild: true,
//           child: [
//             {
//               node: [
//                 {
//                   url: "child2",
//                   title: "childtitle2",
//                   hasPrevious: true,
//                   hasChild: true,
//                   isFirstChild: true,
//                   child: [
//                     {
//                       node: [
//                         {
//                           url: "child4",
//                           title: "childtitle4",
//                           hasPrevious: false,
//                           hasChild: false,
//                           isFirstChild: true,
//                         },
//                       ]
// }
//                   ],
//                 },
//                 {
//                   url: "child3",
//                   title: "childtitle3",
//                   hasPrevious: true,
//                   hasChild: false,
//                 },
//    ]
//  }
//           ],
//         },
//         {
//           url: "url4",
//           title: "title4",
//           hasPrevious: true,
//           hasChild: false,
//         },
//       ],
//     },
//   ];



  function generateNestedList(nodes: TabNode[]): JSX.Element {
    return (
      <ul className="ul" key={`ul-${Math.floor((Math.random() * 100) + 1)}`}>
        {nodes.map((node, index) => (
          <Fragment>
            {node.isFirstChild && (
              <li className="li" key={`node-${node.globalIndex}`}>
                <div key={`node-div-${node.globalIndex}`}>
                  <div className="childConnector" key={`node-div-div-${node.globalIndex}`}></div>
                </div>
              </li>
            )}
            {node.hasPrevious && !node.isFirstChild && (
              <li key={`sibling-${index}`} className="li">
                <div key={`sibling-div-${index}`}>
                  <div className="seperator" key={`sibling-div-div${index}`}></div>
                </div>
              </li>
            )}
            <li key={`li-${index}`} className="li">
              <div key={`li-div-${index}`}>
                <p key={`li-div-p${index}`}>{node.url}</p>
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
          <div key={`div-${index}`}>{generateNestedList(treeNode?.node)}</div>
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
