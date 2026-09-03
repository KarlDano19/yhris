'use client';

import { Tree, TreeNode } from 'react-organizational-chart';
import { Tooltip } from 'react-tooltip';

import { T_OrgStructureNode } from '../hooks/useGetOrgStructureForHandbook';

// Read-only diagram for the Policy Handbook's Org Structure section - reuses the same
// react-organizational-chart library the Manage > Org Structure chart is built on, but as a
// new, lightweight component: no click handlers, no edit modals, no employee data. A Policy
// Handbook is shared reference content, so this only ever renders structure (names, types,
// descriptions), never who currently holds a role.

const NODE_TOOLTIP_ID = 'policy-handbook-org-node-tooltip';

const nodeLabel = (node: T_OrgStructureNode, isRoot: boolean) => {
  const label = node.position_name || node.department_name || 'Unassigned';
  const isDepartment = node.node_type === 'department';

  return (
    <div
      className={`inline-block max-w-[12rem] truncate rounded-md border px-3 py-1.5 text-xs font-medium shadow-sm ${
        isRoot
          ? 'border-indigo-dye bg-indigo-dye text-white'
          : isDepartment
          ? 'border-dashed border-gray-300 bg-gray-50 text-gray-600'
          : 'border-savoy-blue bg-white text-indigo-dye'
      }`}
      data-tooltip-id={node.description ? NODE_TOOLTIP_ID : undefined}
      data-tooltip-content={node.description || undefined}
      data-tooltip-place='top'
    >
      {label}
    </div>
  );
};

const renderChildren = (nodes?: T_OrgStructureNode[]) =>
  nodes?.map((node) => (
    <TreeNode key={node.id} label={nodeLabel(node, false)}>
      {renderChildren(node.children)}
    </TreeNode>
  ));

const OrgStructureDiagram = ({ roots }: { roots: T_OrgStructureNode[] }) => {
  if (!roots.length) return null;

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-100 bg-gray-50 p-6 mb-4">
      <div className="flex flex-wrap items-start justify-center gap-10">
        {roots.map((root) => (
          <Tree key={root.id} lineWidth="2px" lineColor="#355FD0" lineBorderRadius="8px" label={nodeLabel(root, true)}>
            {renderChildren(root.children)}
          </Tree>
        ))}
      </div>
      <Tooltip id={NODE_TOOLTIP_ID} />
    </div>
  );
};

export default OrgStructureDiagram;
