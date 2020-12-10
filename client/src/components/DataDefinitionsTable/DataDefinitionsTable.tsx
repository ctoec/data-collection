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
  isFirstReportingPeriodRow,
  FIRST_REPORTING_PERIOD_ALERT_ROW,
  isFirstReportingPeriodAlertRow,
  EnhancedColumnMetadata,
  getSiteFormatters,
} from './utils';
import UserContext from '../../contexts/UserContext/UserContext';

type DataDefinitionsTableProps = {
  headerLevel: HeadingLevel;
  showRequirementLevelLegendAndFilter?: boolean;
  addFirstReportingPeriodAlert?: boolean;
};

const DataDefinitionsTable: React.FC<DataDefinitionsTableProps> = ({
  headerLevel,
  showRequirementLevelLegendAndFilter = false,
  addFirstReportingPeriodAlert = false,
}) => {
  const Heading = headerLevel;
  const { user } = useContext(UserContext);
  const [requiredFilter, setRequiredFilter] = useState<boolean>(false);

  const { data: templateMetadata } = useSWR('template/metadata', {
    dedupingInterval: 100000,
  }) as responseInterface<TemplateMetadata, string>;

  if (!templateMetadata) {
    return <LoadingWrapper loading={true} />;
  }

  let filteredColumnMetadata: EnhancedColumnMetadata[] = templateMetadata.columnMetadata;
  if (requiredFilter) {
    // If only the required fields are shown right now
    filteredColumnMetadata = filteredColumnMetadata.filter(
      (m) =>
        m.requirementLevel === TEMPLATE_REQUIREMENT_LEVELS.REQUIRED ||
        m.requirementLevel === TEMPLATE_REQUIREMENT_LEVELS.CONDITIONAL
    );
  }

  const firstReportingPeriodRowIdx = filteredColumnMetadata.findIndex(
    isFirstReportingPeriodRow
  );
  const firstReportingPeriodAlertRowIdx = filteredColumnMetadata.findIndex(
    isFirstReportingPeriodAlertRow
  );
  if (
    addFirstReportingPeriodAlert &&
    firstReportingPeriodRowIdx > -1 &&
    firstReportingPeriodAlertRowIdx === -1
  ) {
    filteredColumnMetadata.splice(
      firstReportingPeriodRowIdx + 1,
      0,
      FIRST_REPORTING_PERIOD_ALERT_ROW
    );
  }

  if (user) {
    // TODO: this prob has to be memoized
    const siteRow = filteredColumnMetadata.find(row => row.propertyName === 'site');
    siteRow!.columnFormatters = getSiteFormatters(user.sites || []);
  }

  const columnMetadataBySection: { [key: string]: EnhancedColumnMetadata[] } = {};
  filteredColumnMetadata.reduce((_bySection, _metadata) => {
    if (_bySection[_metadata.section]) {
      _bySection[_metadata.section].push(_metadata);
    } else {
      _bySection[_metadata.section] = [_metadata];
    }

    return _bySection;
  }, columnMetadataBySection);

  return (
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
              <Heading>{sectionName}</Heading>
              <p className="text-pre-line">{getSectionCopy(sectionName)}</p>
              <Table
                id={`data-requirements-${sectionName.replace(' ', '-')}`}
                data={sectionData}
                rowKey={(row) => (row ? row.formattedName : '')}
                columns={TableColumns(addFirstReportingPeriodAlert)}
                defaultSortColumn={0}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
};

const getSectionCopy = (section: string) => {
  if (section === TEMPLATE_SECTIONS.CHILD_IDENT)
    return 'Data used to identify unique children enrolled in an ECE program.';
  if (section === TEMPLATE_SECTIONS.CHILD_INFO)
    return "Data on children's circumstances. This data is used to ensure children from different backgrounds are equitably served by ECE programs.";
  if (section === TEMPLATE_SECTIONS.FAMILY_INCOME)
    return 'This data is collected to assess eligibility for public funding by calculating state median income percentage. Income determinations must be updated at least once a year.';
  if (section === TEMPLATE_SECTIONS.FAMILY_ADDRESS)
    return 'One or more children that share the same address and household income.';
  if (section === TEMPLATE_SECTIONS.ENROLLMENT_FUNDING)
    return 'Enrollment: A period of time during which a child recieved ECE services.\nFunding: A period of time during which an enrollment was subsidized by a state-funded contract space.';
};
export default DataDefinitionsTable;
