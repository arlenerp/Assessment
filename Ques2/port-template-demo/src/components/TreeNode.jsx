import React, { useEffect, useRef } from "react";
import ActionBar from "./ActionBar";
import "./TreeNode.css";
import { useTree } from "../context/TreeContext";

function TreeNode({ node }) {
  const { dispatch, nodeRefs } = useTree();
  const inputRef = useRef();

  useEffect(() => {
    nodeRefs.current[node.id] = inputRef.current?.parentElement;
    if (node.active && inputRef.current) inputRef.current.focus();
    return () => {
      delete nodeRefs.current[node.id];
    };
  }, [node.active, node.id, nodeRefs]);

  return (
    <div className="node">
      <div className="node-row">
        <input
          ref={inputRef}
          type="text"
          value={node.label}
          onChange={(e) => dispatch({ type: "UPDATE_LABEL", id: node.id, value: e.target.value })}
          readOnly={node.readonly}
          className="node-input"
          onFocus={() => dispatch({ type: "SET_ACTIVE", id: node.id, active: true })}
          onBlur={(e) => {
            setTimeout(() => {
              if (!e.currentTarget.parentElement.contains(document.activeElement)) {
                dispatch({ type: "SET_ACTIVE", id: node.id, active: false });
              }
            }, 150);
          }}
        />
        <ActionBar node={node} />
      </div>

      {node.children.length > 0 && (
        <div className="children">
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}

export default TreeNode;
