import React, { createContext, useReducer, useContext, useRef } from "react";

const TreeContext = createContext();
export const useTree = () => useContext(TreeContext);

const createNode = (parentId = null, siblings = []) => {
  let id;
  if (parentId === null) {
    id = siblings.length.toString(); 
  } else {
    id = `${parentId}.${siblings.length}`;
  }

  return {
    id,
    label: "",
    readonly: false,
    children: [],
    active: true,
  };
};

const deactivateAll = (nodes) =>
  nodes.map((n) => ({ ...n, active: false, children: deactivateAll(n.children) }));

const getDepth = (nodes, id, depth = 1) => {
  for (const node of nodes) {
    if (node.id === id) return depth;
    const childDepth = getDepth(node.children, id, depth + 1);
    if (childDepth) return childDepth;
  }
  return null;
};

const updateNodeRecursively = (node, callback) => ({
  ...node,
  children: node.children.map((child) => updateNodeRecursively(child, callback)),
  ...callback(node),
});

const treeReducer = (state, action) => {
  switch (action.type) {
    case "ADD_PARENT": {
      const newNode = createNode(null, state);
      return [...deactivateAll(state), newNode];
    }

    case "ADD_CHILD": {
      const addChildRecursively = (node) => {
        if (node.id === action.id) {

          const newChild = createNode(node.id, node.children);
          return { ...node, active: true, children: [...node.children, newChild] };
        }
        return { ...node, children: node.children.map(addChildRecursively) };
      };

      const depth = getDepth(state, action.id);
      if (depth >= 8) {
        alert("You can only have up to 8 levels of children.");
        return state;
      }

      return state.map(addChildRecursively);
    }

    case "DELETE_NODE": {
      const deleteRecursively = (nodes) =>
        nodes
          .map((n) => ({ ...n, children: deleteRecursively(n.children) }))
          .filter((n) => n.id !== action.id);
      return deleteRecursively(state);
    }

    case "UPDATE_LABEL":
      return state.map((node) =>
        updateNodeRecursively(node, (n) => (n.id === action.id ? { label: action.value } : {}))
      );

    case "TOGGLE_READONLY":
      return state.map((node) =>
        updateNodeRecursively(node, (n) => (n.id === action.id ? { readonly: !n.readonly } : {}))
      );

    case "SET_ACTIVE": {
      const setActiveRecursively = (node) => ({
        ...node,
        active: node.id === action.id ? action.active : false,
        children: node.children.map(setActiveRecursively),
      });
      return state.map(setActiveRecursively);
    }

    case "SET_TREE":
      return action.tree;

    default:
      return state;
  }
};

export const TreeProvider = ({ children }) => {
  const [tree, dispatch] = useReducer(treeReducer, []);
  const nodeRefs = useRef({});

  const saveToFile = () => {
    const blob = new Blob([JSON.stringify(tree, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "port-template.json";
    a.click();
  };

  const loadFromFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (Array.isArray(data)) dispatch({ type: "SET_TREE", tree: data });
        else alert("Invalid JSON format");
      } catch {
        alert("Error parsing file");
      }
    };
    reader.readAsText(file);
  };

  return (
    <TreeContext.Provider value={{ tree, dispatch, saveToFile, loadFromFile, nodeRefs }}>
      {children}
    </TreeContext.Provider>
  );
};
