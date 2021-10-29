import React from "react";

export const EmptyContent = ({ children }) => {
  return (
    <div style={{ border: "2px dashed var(--iconColor)", padding: "2rem" }}>
      {children}
    </div>
  );
};
