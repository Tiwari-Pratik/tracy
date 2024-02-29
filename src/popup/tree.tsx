
import React from 'react';
import { Tree } from 'react-d3-tree';

interface Node {
  name: string;
  children?: Node[];
}

const data: Node = {
  name: 'Root',
  children: [
    {
      name: 'Node 1',
      children: [
        {
          name: 'Node 1.1',
        },
        {
          name: 'Node 1.2',
        },
      ],
    },
    {
      name: 'Node 2',
      children: [
        {
          name: 'Node 2.1',
        },
        {
          name: 'Node 2.2',
        },
      ],
    },
  ],
};

const HorizontalTree: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Tree
      
        data={data}
        orientation="horizontal"
        translate={{ x: 200, y: 100 }}
        pathFunc="step"
        collapsible={false} // Adjust as needed
        separation={{ siblings: 1, nonSiblings: 1 }}
      />
    </div>
  );
};

export default HorizontalTree;
