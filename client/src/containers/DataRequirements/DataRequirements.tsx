import React from 'react';
import { BackButton } from '../../components/BackButton';
import { Link } from 'react-router-dom';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import DataDefinitionsTable from '../../components/DataDefinitionsTable/DataDefinitionsTable';
import useSWR, { responseInterface } from 'swr';
import { TemplateMetadata } from '../../shared/payloads';

const DataRequirements: React.FC = () => {
  const h1Ref = getH1RefForTitle();

  const { data: templateMetadata } = useSWR('template/metadata', {
    dedupingInterval: 100000,
  }) as responseInterface<TemplateMetadata, string>;

  return (
    <div className="grid-container margin-top-4">
      <BackButton />
      <h1 ref={h1Ref}>OEC's enrollment data requirements</h1>
      <p>
        Last updated:{' '}
        <span className="text-bold">
          {templateMetadata
            ? templateMetadata.lastUpdated.format('MMMM DD, YYYY')
            : ''}
        </span>
      </p>
      <p>
        ECE Reporter will allow you to share your state-funded enrollment data
        with the Office of Early Childhood (OEC).
      </p>
      <p>
        <span className="text-bold">Enrollments to include</span>
        <br />
        Children receiving funding through the following programs:
      </p>
      <ul>
        <li>Child Day Care</li>
        <li>Priority School Readiness</li>
        <li>Competative School Readiness</li>
        <li>Smart Start</li>
        <li>State Head Start</li>
      </ul>
      <p>
        <span className="text-bold">Data collection period</span>
        <br />
        The data collection period begins 07/01/2020 and continues through
        12/31/2020.
      </p>
      <p>
        <span className="text-bold">Data submission deadline</span>
        <br />
        You must submit your data to OECby 03/05/2021.
      </p>
      <DataDefinitionsTable headerLevel="h2" showDataElementsSection />
    </div>
  );
};

export default DataRequirements;
