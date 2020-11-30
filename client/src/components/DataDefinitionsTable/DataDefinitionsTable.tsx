import React, { useState } from 'react';
import { ColumnMetadata } from '../../shared/models';
import { Table, HeadingLevel, LoadingWrapper } from '@ctoec/component-library';
import { TemplateMetadata } from '../../shared/payloads';
import { TEMPLATE_REQUIREMENT_LEVELS } from '../../shared/constants';
import { RequirementLevelLegend } from './RequirementLevelLegend';
import { RequirementLevelFilter } from './RequirementLevelFilter';
import { TableColumns } from './TableColumns';
import useSWR, { responseInterface } from 'swr';

type DataDefinitionsTableProps = {
  headerLevel: HeadingLevel;
  showDataElementsSection?: boolean;
};

const DataDefinitionsTable: React.FC<DataDefinitionsTableProps> = ({
  headerLevel,
  showDataElementsSection,
}) => {
  const Heading = headerLevel;
  const [requiredFilter, setRequiredFilter] = useState<boolean>(false);

  const { data: templateMetadata } = useSWR('template/metadata', {
    dedupingInterval: 100000,
  }) as responseInterface<TemplateMetadata, string>;

  if (!templateMetadata) {
    return <LoadingWrapper loading={true} />;
  }

  let filteredColumnMetadata = templateMetadata.columnMetadata;
  if (requiredFilter) {
    filteredColumnMetadata = filteredColumnMetadata.filter(
      (m) =>
        m.requirementLevel === TEMPLATE_REQUIREMENT_LEVELS.REQUIRED ||
        m.requirementLevel === TEMPLATE_REQUIREMENT_LEVELS.CONDITIONAL
    );
  }

  const columnMetadataBySection: { [key: string]: ColumnMetadata[] } = {};
  filteredColumnMetadata.reduce((_bySection, _metadata) => {
    if (_bySection[_metadata.section]) {
      _bySection[_metadata.section].push(_metadata);
    } else {
      _bySection[_metadata.section] = [_metadata];
    }

    return _bySection;
  }, columnMetadataBySection);

  return (
    <>
      {showDataElementsSection && (
        <>
          <Heading>Data elements</Heading>
          <RequirementLevelLegend />
          <RequirementLevelFilter setFilter={setRequiredFilter} />
        </>
      )}
      <div>
        {Object.entries(columnMetadataBySection).map(
          ([sectionName, sectionData]) => (
            <div key={sectionName} className="margin-top-4">
              <Heading>{sectionName}</Heading>
              <p className="text-pre-line">{getSectionCopy(sectionName)}</p>
              <Table
                id={`data-requirements-${sectionName.replace(' ', '-')}`}
                data={sectionData}
                rowKey={(row) => (row ? row.formattedName : '')}
                columns={TableColumns}
                defaultSortColumn={0}
              />
            </div>
          )
        )}
      </div>
    </>
  );
};

const getSectionCopy = (section: string) => {
  if (section.toLowerCase().includes('child identifier'))
    return 'Data used to identify unique children enrolled in an ECE program.';
  if (section.toLocaleLowerCase().includes('child information'))
    return "Data on children's circumstances. This data is used to ensure children from different backgrounds are equitably served by ECE programs.";
  if (section.toLowerCase().includes('income'))
    return 'This data is collected to assess eligibility for public funding by calculating state median income percentage. Income determinations must be updated at least once a year.';
  if (section.toLowerCase().includes('family'))
    return 'One or more children that share the same address and household income.';
  if (section.toLowerCase().includes('enrollment'))
    return 'Enrollment: A period of time during which a child recieved ECE services.\nFunding: A period of time during which an enrollment was subsidized by a state-funded contract space.';
};
export default DataDefinitionsTable;
