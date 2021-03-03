import React, { useState, useEffect } from 'react';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import {
  SideNav,
  TextWithIcon,
  ArrowRight,
  InlineIcon,
  ErrorBoundary,
  LoadingWrapper,
} from '@ctoec/component-library';
import { BackButton } from '../../components/BackButton';
import { hasValidationError } from '../../utils/hasValidationError';
import pluralize from 'pluralize';
import { nameFormatter } from '../../utils/formatters';
import { Link, useParams, useLocation } from 'react-router-dom';
import { BatchEditItemContent } from './BatchEditItemContent';
import { Child } from '../../shared/models';
import { getBatchEditErrorDetailsString } from './listSteps';
import { useAuthenticatedSWR } from '../../hooks/useAuthenticatedSWR';
import { stringify, parse } from 'query-string';
import { defaultErrorBoundaryProps } from '../../utils/defaultErrorBoundaryProps';
import { useAlerts } from '../../hooks/useAlerts';

const BatchEdit: React.FC = () => {
  const { childId } = useParams() as { childId: string };
  const { organizationId } = parse(useLocation().search) as {
    organizationId: string;
  };
  const { alertElements } = useAlerts();

  const h1Ref = getH1RefForTitle();
  const { data: children, isValidating, mutate, error } = useAuthenticatedSWR<
    Child[]
  >(
    childId
      ? null // no need to fetch all children for single record batch edit
      : `children?${stringify({ organizationId, 'missing-info': true })}`,
    {
      revalidateOnFocus: false,
    }
  );
  const loading = !children && !error;
  // Only children with validation errors, only set after initial fetch
  const [fixedRecordsForDisplayIds, setFixedRecordsForDisplayIds] = useState<
    string[]
  >([]);

  useEffect(() => {
    if (!isValidating && children?.length) {
      setFixedRecordsForDisplayIds(
        children.filter(hasValidationError).map((child) => child.id)
      );
    }
  }, [isValidating, !!children]);

  const fixedRecordsForDisplay = fixedRecordsForDisplayIds.map((id) =>
    (children || []).find((c) => c.id === id)
  ) as Child[];
  const currentlyMissingInfoCount = fixedRecordsForDisplay.filter(
    hasValidationError
  ).length;

  const [activeRecordId, setActiveRecordId] = useState<string>();
  useEffect(() => {
    if (fixedRecordsForDisplayIds.length)
      setActiveRecordId(fixedRecordsForDisplayIds[0]);
  }, [fixedRecordsForDisplayIds.length]);

  const moveNextRecord = (updatedRecords?: Child[]) => {
    const activeRecordIdx = fixedRecordsForDisplayIds.findIndex(
      (id) => id === activeRecordId
    );

    // If active record is last record in the list
    if (activeRecordIdx === fixedRecordsForDisplayIds.length - 1) {
      // Then look for the first record that is still missing info
      // (in `updatedRecords` - the most up-to-date version of the records passed as function arg,
      // or in `fixedRecordsForDisplay` the local state var holding those records here in this component,
      // which for some reason is not being updated until the next render loop)
      const firstStillMissingInformationRecord = (
        updatedRecords || fixedRecordsForDisplay
      ).find(hasValidationError);

      // And set the active record id to that record, if it exists
      // otherwise to undefined, which indicates the complete state
      setActiveRecordId(firstStillMissingInformationRecord?.id);
    }
    // otherwise, move to next record in the list
    else {
      setActiveRecordId(fixedRecordsForDisplayIds[activeRecordIdx + 1]);
    }
  };

  if (childId) {
    return (
      <div className="grid-container">
        <BatchEditItemContent
          childId={childId}
          moveNextRecord={() => {}}
          isSingleRecord={true}
        />
      </div>
    );
  }

  return (
    <div className="grid-container">
      <BackButton text="Back to roster" location="/roster" />
      {alertElements}
      <h1 ref={h1Ref} className="margin-bottom-1">
        Add needed information
      </h1>
      <LoadingWrapper loading={loading}>
        <ErrorBoundary alertProps={{ ...defaultErrorBoundaryProps }}>
          <div className="display-flex font-body-lg height-5 line-height-body-6 margin-y-0">
            {currentlyMissingInfoCount ? (
              <>
                <div className="text-white text-bold text-center bg-primary width-5 radius-pill margin-right-1">
                  {currentlyMissingInfoCount}
                </div>
                {pluralize('record', currentlyMissingInfoCount)}{' '}
                {pluralize('has', currentlyMissingInfoCount)} missing or
                incomplete info required to submit your data
              </>
            ) : (
              <>
                {/* TODO make it possible to make this icon big */}
                <InlineIcon className="height-4 width-4" icon="complete" /> All
                enrollments are complete
              </>
            )}
          </div>
          <SideNav
            activeItemId={activeRecordId}
            items={fixedRecordsForDisplay.map((record) => ({
              id: record.id,
              onClick: () => setActiveRecordId(record?.id),
              title: (
                <span>
                  {nameFormatter(record, {
                    lastNameFirst: true,
                    capitalize: true,
                  })}
                  {!hasValidationError(record) && (
                    <InlineIcon icon="complete" />
                  )}
                </span>
              ),
              description: getBatchEditErrorDetailsString(record),
            }))}
          >
            {activeRecordId !== undefined ? (
              <ErrorBoundary alertProps={{ ...defaultErrorBoundaryProps }}>
                <BatchEditItemContent
                  childId={activeRecordId}
                  moveNextRecord={moveNextRecord}
                  organizationId={organizationId}
                  mutate={mutate}
                />
              </ErrorBoundary>
            ) : (
              <div className="margin-x-4 margin-top-4 display-flex flex-column flex-align-center">
                <InlineIcon icon="complete" />
                <p className="font-body-lg text-bold margin-y-1">
                  All records are complete!
                </p>
                <Link to="/roster">
                  <TextWithIcon
                    text="Back to roster"
                    iconSide="right"
                    Icon={ArrowRight}
                    direction="right"
                  />
                </Link>
              </div>
            )}
          </SideNav>
        </ErrorBoundary>
      </LoadingWrapper>
    </div>
  );
};

export default BatchEdit;
