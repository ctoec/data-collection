import React from 'react';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';

const BatchEdit: React.FC = () => {
  const h1Ref = getH1RefForTitle();
  return (
    <div className="grid-row">
      <h1 ref={h1Ref}>Batch Edit Roster</h1>
    </div>
  );
};

export default BatchEdit;
