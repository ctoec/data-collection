import React from 'react';
import { BackButton } from '../../components/BackButton';
import { Link } from 'react-router-dom';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import DataDefinitionsTable from '../../components/DataDefinitionsTable';

const DataRequirements: React.FC = () => {
  const h1Ref = getH1RefForTitle();

  return (
    <div className="grid-container margin-top-4">
      <BackButton />
      <h1 ref={h1Ref}>OEC's enrollment data requirements</h1>
      <p className="text-pre-line">
        Looking for info on how to format contract space types?
        <br />
        See <Link to="/funding-space-types">funding space types</Link>.
      </p>
      <DataDefinitionsTable headerLevel="h2" />
    </div>
  );
};

export default DataRequirements;
