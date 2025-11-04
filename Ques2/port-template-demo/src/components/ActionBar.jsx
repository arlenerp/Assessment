import React from "react";
import "./ActionBar.css";
import btnDelete from "../assets/delete.png";
import { useTree } from "../context/TreeContext";

function ActionBar({ node }) {

  const { dispatch } = useTree();

  return (
    <div className={`actions-bar ${node.active ? "visible" : ""}`}>
      <div className="switch-delete">
        <span>Read only</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={node.readonly}
            onChange={() => dispatch({ type: "TOGGLE_READONLY", id: node.id })}
            onMouseDown={(e) => e.preventDefault()}
          />
          <span className="slider"></span>
        </label>

        <button className="del-btn" onClick={() => dispatch({ type: "DELETE_NODE", id: node.id })}>
          <img src={btnDelete} alt="Delete" />
        </button>
      </div>

      <button className="add-btn small" onClick={() => dispatch({ type: "ADD_CHILD", id: node.id })}>
        +
      </button>
    </div>
  );
}

export default ActionBar;