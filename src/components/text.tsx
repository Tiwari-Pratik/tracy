import React, { Fragment } from "react";
import "./test.css";
const TestList = () => {
  type Node = {
    url: string;
    title: string;
    hasPrevious: boolean;
    hasChild: boolean;
    child?: Node[];
    isFirstChild?: boolean;
  };

  type TreeNode = {
    node: Node[];
  };

  type Tree = TreeNode[];

  const data: Tree = [
    {
      node: [
        {
          url: "url1",
          title: "title1",
          hasPrevious: false,
          hasChild: false,
        },
        {
          url: "url2",
          title: "title2",
          hasPrevious: true,
          hasChild: true,
          child: [
            {
              url: "child1",
              title: "childtitle1",
              hasPrevious: false,
              hasChild: false,
              isFirstChild: true,
            },
          ],
        },
      ],
    },
    {
      node: [
        {
          url: "url3",
          title: "title3",
          hasPrevious: false,
          hasChild: true,
          child: [
            {
              url: "child2",
              title: "childtitle2",
              hasPrevious: true,
              hasChild: true,
              isFirstChild: true,
              child: [
                {
                  url: "child4",
                  title: "childtitle4",
                  hasPrevious: false,
                  hasChild: false,
                  isFirstChild: true,
                },
              ],
            },
            {
              url: "child3",
              title: "childtitle3",
              hasPrevious: true,
              hasChild: false,
            },
          ],
        },
        {
          url: "url4",
          title: "title4",
          hasPrevious: true,
          hasChild: false,
        },
      ],
    },
  ];

  // function generateNestedList(nodes: Node[]): string {
  //   let htmlString = "<ul className='ul'>";
  //
  //   for (const node of nodes) {
  //     htmlString += `<li className='li'><div><p>${node.title}</p></div>`;
  //
  //     if (node.hasChild && node.child) {
  //       htmlString += generateNestedList(node.child);
  //     }
  //     htmlString += "</li>";
  //     if (node.hasSibling) {
  //       htmlString += `<li><div><div className='seperator'></div></div></li>`;
  //     }
  //   }
  //
  //   htmlString += "</ul>";
  //   return htmlString;
  // }

  // function generateHTML(tree: Tree): string[] {
  //   let htmlString: string[] = [];
  //
  //   for (const treeNode of tree) {
  //     htmlString.push(generateNestedList(treeNode.node));
  //   }
  //
  //   return htmlString;
  // }
  //

  function generateNestedList(nodes: Node[]): JSX.Element {
    return (
      <ul className="ul">
        {nodes.map((node, index) => (
          <Fragment>
            {node.isFirstChild && (
              <li className="li">
                <div>
                  <div className="childConnector"></div>
                </div>
              </li>
            )}
            {node.hasPrevious && !node.isFirstChild && (
              <li key={`sibling-${index}`} className="li">
                <div>
                  <div className="seperator"></div>
                </div>
              </li>
            )}
            <li key={index} className="li">
              <div>
                <p>{node.title}</p>
              </div>
              {node.hasChild && node.child && generateNestedList(node.child)}
            </li>
          </Fragment>
        ))}
      </ul>
    );
  }

  function generateHTML(tree: Tree): JSX.Element {
    return (
      <>
        {tree.map((treeNode, index) => (
          <div key={index}>{generateNestedList(treeNode.node)}</div>
        ))}
      </>
    );
  }

  // Call the generateHTML function with your data
  const jsxOutput = generateHTML(data);

  return (
    <div className="container-list">
      {/*<ul className="ul">
        <li className="li">
          <div>
            <p>Item1</p>
          </div>
        </li>
        <li className="li">
          <div>
            <div className="seperator"></div>
          </div>
        </li>
        <li className="li">
          <div>
            <p>Item2</p>
            <ul className="ul">
              <li className="li">
                <div>
                  <div className="childConnector"></div>
                </div>
              </li>
              <li className="li">
                <div>
                  <p>Item2.1</p>
                </div>
              </li>
              <li className="li">
                <div>
                  <div className="seperator"></div>
                </div>
              </li>
              <li className="li">
                <div>
                  <p>Item2.2</p>
                </div>
              </li>
              <li className="li">
                <div>
                  <div className="seperator"></div>
                </div>
              </li>
              <li className="li">
                <div>
                  <p>Item2.2</p>
                </div>
              </li>
            </ul>
          </div>
        </li>
        <li className="li">
          <div>
            <div className="seperator"></div>
          </div>
        </li>
        <li className="li">
          <div>
            <p>Item3</p>
            <ul className="ul">
              <li className="li">
                <div>
                  <div className="childConnector"></div>
                </div>
              </li>
              <li className="li">
                <div>
                  <p>Item3.1</p>
                </div>
              </li>
            </ul>
            <ul className="ul">
              <li className="li">
                <div>
                  <div className="childConnector"></div>
                </div>
              </li>
              <li className="li">
                <div>
                  <p>Item3.2.1</p>
                  <ul className="ul">
                    <li className="li">
                      <div>
                        <div className="childConnector"></div>
                      </div>
                    </li>
                    <li className="li">
                      <div>
                        <p>Item3.2.1.1</p>
                      </div>
                    </li>
                    <li className="li">
                      <div>
                        <div className="seperator"></div>
                      </div>
                    </li>
                    <li className="li">
                      <div>
                        <p>Item3.2.1.2</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </li>
              <li className="li">
                <div>
                  <div className="seperator"></div>
                </div>
              </li>
              <li className="li">
                <div>
                  <p>Item3.2.2</p>
                </div>
              </li>
            </ul>
          </div>
        </li>
        <li className="li">
          <div>
            <div className="seperator"></div>
          </div>
        </li>
        <li className="li">
          <div>
            <p>Item4</p>
          </div>
        </li>
        <li className="li">
          <div>
            <div className="seperator"></div>
          </div>
        </li>
        <li className="li">
          <div>
            <p>Item5</p>
            <ul className="ul">
              <li className="li">
                <div>
                  <div className="childConnector"></div>
                </div>
              </li>
              <li className="li">
                <div>
                  <p>Item5.1</p>
                </div>
              </li>
              <li className="li">
                <div>
                  <div className="seperator"></div>
                </div>
              </li>
              <li className="li">
                <div>
                  <p>Item5.2</p>
                </div>
              </li>
              <li className="li">
                <div>
                  <div className="seperator"></div>
                </div>
              </li>
              <li className="li">
                <div>
                  <p>Item5.3</p>
                </div>
              </li>
            </ul>
          </div>
        </li> 
        </ul>*/}

      {jsxOutput}
    </div>
  );
};

export default TestList;
