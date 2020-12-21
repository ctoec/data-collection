import React from 'react';
import { BackButton } from '../../components/BackButton';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import DataDefinitionsTable from '../../components/DataDefinitionsTable/DataDefinitionsTable';
import useSWR, { responseInterface } from 'swr';
import { TemplateMetadata } from '../../shared/payloads';
import { FundingSource } from '../../shared/models';

const DataRequirements: React.FC = () => {
  const h1Ref = getH1RefForTitle();

  const { data: templateMetadata } = useSWR('template/metadata', {
    dedupingInterval: 100000,
  }) as responseInterface<TemplateMetadata, string>;

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
        ECE Reporter will allow you to share your state-funded enrollment data
        with the Office of Early Childhood (OEC).
      </p>
      <p>
        <span className="text-bold">Enrollments to include</span>
        <br />
        Children receiving funding through the following programs:
      </p>
      <ul>
        {Object.values(FundingSource).map((fundingSource) => (
          <li>{fundingSource.split('-')[1]}</li>
        ))}
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
        You must submit your data to OEC by 03/05/2021.
      </p>
      <h2 className="border-top border-base-lighter padding-top-1">
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
