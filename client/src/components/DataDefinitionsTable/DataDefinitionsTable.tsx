import React, { useContext, useState } from 'react';
import { Table, HeadingLevel, LoadingWrapper } from '@ctoec/component-library';
import { TemplateMetadata } from '../../shared/payloads';
import {
  TEMPLATE_REQUIREMENT_LEVELS,
  TEMPLATE_SECTIONS,
} from '../../shared/constants';
import { RequirementLevelLegend } from './RequirementLevelLegend';
import { RequirementLevelFilter } from './RequirementLevelFilter';
import { TableColumns } from './TableColumns';
import useSWR, { responseInterface } from 'swr';
import {
  EnhancedColumnMetadata,
  getSiteFormatters,
  getProviderFormatters,
} from './utils';
import UserContext from '../../contexts/UserContext/UserContext';
import { Heading } from '../Heading';
import { kebabCase } from 'lodash';

type DataDefinitionsTableProps = {
  headerLevel: HeadingLevel;
  showRequirementLevelLegendAndFilter?: boolean;
};

const DataDefinitionsTable: React.FC<DataDefinitionsTableProps> = ({
  headerLevel,
  showRequirementLevelLegendAndFilter = false,
}) => {
  const { user } = useContext(UserContext);
  const [requiredFilter, setRequiredFilter] = useState<boolean>(false);

  const { data: templateMetadata } = useSWR('template/metadata', {
    dedupingInterval: 100000,
  }) as responseInterface<TemplateMetadata, string>;
  const { columnMetadata } = templateMetadata || {};

  let filteredColumnMetadata: EnhancedColumnMetadata[] = columnMetadata || [];

  if (requiredFilter) {
    // If only the required fields are shown right now
    filteredColumnMetadata = filteredColumnMetadata.filter(
      (m) =>
        m.requirementLevel === TEMPLATE_REQUIREMENT_LEVELS.REQUIRED ||
        m.requirementLevel === TEMPLATE_REQUIREMENT_LEVELS.CONDITIONAL
    );
  }

  if (user && filteredColumnMetadata.length) {
    const siteRow = filteredColumnMetadata.find(
      (row) => row.propertyName === 'site'
    );
    siteRow!.columnFormatters = getSiteFormatters(user.sites || []);

    const providerRow = filteredColumnMetadata.find(
      (row) => row.propertyName === 'providerName'
    );
    providerRow!.columnFormatters = getProviderFormatters(user.organizations);
  }

  const columnMetadataBySection: {
    [key: string]: EnhancedColumnMetadata[];
  } = {};
  filteredColumnMetadata.reduce((_bySection, _metadata) => {
    if (_bySection[_metadata.section]) {
      _bySection[_metadata.section].push(_metadata);
    } else {
      _bySection[_metadata.section] = [_metadata];
    }

    return _bySection;
  }, columnMetadataBySection);

  return (
    <LoadingWrapper loading={!templateMetadata}>
      <div className="data-definitions">
        {showRequirementLevelLegendAndFilter && (
          <>
            <RequirementLevelLegend />
            <RequirementLevelFilter setFilter={setRequiredFilter} />
          </>
        )}
        <div>
          {Object.entries(columnMetadataBySection).map(
            ([sectionName, sectionData]) => (
              <div key={sectionName} className="margin-top-4">
                <Heading id={kebabCase(sectionName)} level={headerLevel}>{sectionName}</Heading>
                <p className="text-pre-line">{getSectionCopy(sectionName)}</p>
                <Table
                  id={`data-requirements-${sectionName.replace(' ', '-')}`}
                  data={sectionData}
                  rowId={(row) => kebabCase(row.formattedName)}
                  rowKey={(row) => (row ? row.formattedName : '')}
                  columns={TableColumns}
                  defaultSortColumn={0}
                />
              </div>
            )
          )}
        </div>
      </div>
    </LoadingWrapper>
  );
};

const getSectionCopy = (section: string) => {
  if (section === TEMPLATE_SECTIONS.CHILD_IDENT)
    return 'Data used to identify unique children enrolled in an ECE program.';
  if (section === TEMPLATE_SECTIONS.CHILD_INFO)
    return "Data on children's circumstances. This data is used to ensure children from different backgrounds are equitably served by ECE programs.";
  if (section === TEMPLATE_SECTIONS.FAMILY_INCOME)
    return 'This data is collected to assess eligibility for public funding by calculating state median income percentage. Income determinations must be updated at least once a year. For the July 1 to Dec 31 data collection: If a child has had multiple income determinations, you only need to enter the most recent determination.';
  if (section === TEMPLATE_SECTIONS.FAMILY_ADDRESS)
    return 'One or more children that share the same address and household income.';
  if (section === TEMPLATE_SECTIONS.ENROLLMENT_FUNDING)
    return 'Enrollment: A period of time during which a child recieved ECE services.\nFunding: A period of time during which an enrollment was subsidized by a state-funded contract space.';
};
export default DataDefinitionsTable;
