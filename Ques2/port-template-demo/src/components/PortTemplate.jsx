import React, { useRef } from "react";
import "./PortTemplate.css";
import TreeNode from "./TreeNode";
import { TreeProvider, useTree } from "../context/TreeContext";

function PortTemplateInner() {
  const { tree, dispatch, saveToFile, loadFromFile } = useTree();
  const fileInputRef = useRef();

  return (
    <div className="tree-container">
      <div className="toolbar">
        <div className="toolbar-left">
          <button className="add-btn" title="Add parent node" onClick={() => dispatch({ type: "ADD_PARENT" })}>+</button>
        </div>
        <div className="toolbar-right">
          <button className="back-btn">Back</button>
          <button className="load-btn" onClick={() => fileInputRef.current.click()}>Load</button>
          <button className="save-btn" onClick={saveToFile}>Save</button>
          <input type="file" ref={fileInputRef} style={{ display: "none" }} accept=".json" onChange={loadFromFile} />
        </div>
      </div>

      <div className="tree">
        {tree.map((node) => (
          <TreeNode key={node.id} node={node} />
        ))}
      </div>
    </div>
  );
}

function PortTemplate() {
  return (
    <TreeProvider>
      <PortTemplateInner />
    </TreeProvider>
  );
}

export default PortTemplate;