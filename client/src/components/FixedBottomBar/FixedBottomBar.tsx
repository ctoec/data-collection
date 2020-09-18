import React from 'react';

export const FixedBottomBar: React.FC = ({ children }) => {
  return (
    <div className="fixed-bottom-bar">
      <div className="shadow-box">
        <div className="grid-container">{children}</div>
      </div>
    </div>
  );
};
