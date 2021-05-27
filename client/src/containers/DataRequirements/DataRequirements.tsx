import React from 'react';
import { BackButton } from '../../components/BackButton';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import DataDefinitionsTable from '../../components/DataDefinitionsTable/DataDefinitionsTable';
import useSWR, { responseInterface } from 'swr';
import { TemplateMetadataResponse } from '../../shared/payloads';
import { FundingSource } from '../../shared/models';

const DataRequirements: React.FC = () => {
  const h1Ref = getH1RefForTitle();

  const { data: templateMetadata } = useSWR('template/metadata', {
    dedupingInterval: 100000,
  }) as responseInterface<TemplateMetadataResponse, string>;

  return (
    <div className="grid-container">
      <BackButton />
      <h1 className="margin-bottom-0" ref={h1Ref}>
        OEC's enrollment data requirements
      </h1>
      <p className="margin-top-05">
        Last updated:{' '}
        <span className="text-bold">
          {templateMetadata
            ? templateMetadata.lastUpdated.format('MMMM DD, YYYY')
            : ''}
        </span>
      </p>
      <p>
        OEC has specific requirements for enrollment data. This page gives you
        all the details about what data is required and what’s optional.
      </p>
      <p>
        <span id="enrollments-to-include" className="text-bold">
          Enrollments to include
        </span>
        <br />
        Children receiving funding through the following programs:
      </p>
      <ul>
        {Object.values(FundingSource).map((fundingSource) => (
          <li>{fundingSource.split('-')[1]}</li>
        ))}
      </ul>
      <p>OEC asks that all users submit updated data at least monthly.</p>
      <h2
        id="data-elements"
        className="border-top border-base-lighter padding-top-1"
      >
        Data elements
      </h2>
      <DataDefinitionsTable
        headerLevel="h3"
        showRequirementLevelLegendAndFilter
      />
    </div>
  );
};

export default DataRequirements;
