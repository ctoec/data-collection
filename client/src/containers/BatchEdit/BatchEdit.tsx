import React, { useContext, useState, useEffect } from 'react';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import {
  SideNav,
  TextWithIcon,
  ArrowRight,
  InlineIcon,
} from '@ctoec/component-library';
import { BackButton } from '../../components/BackButton';
import DataCacheContext from '../../contexts/DataCacheContext/DataCacheContext';
import { hasValidationError } from '../../utils/hasValidationError';
import pluralize from 'pluralize';
import { nameFormatter } from '../../utils/formatters';
import { Link, useParams, useHistory } from 'react-router-dom';
import { BatchEditItemContent } from './BatchEditItemContent';
import { Child } from '../../shared/models';
import { getBatchEditErrorDetailsString } from './listSteps';

const BatchEdit: React.FC = () => {
  const { childId } = useParams() as { childId: string };
  const history = useHistory();
  const h1Ref = getH1RefForTitle();
  const { children } = useContext(DataCacheContext);
  const [fixedRecordsForDisplayIds, setFixedRecordsForDisplayIds] = useState<
    string[]
  >([]);
  useEffect(() => {
    if (!children.loading) {
      setFixedRecordsForDisplayIds(
        children.records.filter(hasValidationError).map((child) => child.id)
      );
    }
  }, [children.loading]);

  const fixedRecordsForDisplay = fixedRecordsForDisplayIds.map((id) =>
    children.getRecordById(id)
  ) as Child[];
  const currentlyMissingInfoCount = fixedRecordsForDisplay.filter(
    hasValidationError
  ).length;

  const [activeRecordId, setActiveRecordId] = useState<string>();
  useEffect(() => {
    if (fixedRecordsForDisplayIds.length)
      setActiveRecordId(fixedRecordsForDisplayIds[0]);
  }, [fixedRecordsForDisplayIds.length]);

  const moveNextRecord = () => {
    // If active record is last record in the list
    const activeRecordIdx = fixedRecordsForDisplayIds.findIndex(
      (id) => id === activeRecordId
    );
    if (activeRecordIdx === fixedRecordsForDisplayIds.length - 1) {
      // Then look for the first record that is still missing info
      const firstStillMissingInformationRecord = fixedRecordsForDisplay.find(
        hasValidationError
      );

      setActiveRecordId(
        // If a no records are missing info, then set active record to none
        !firstStillMissingInformationRecord
          ? undefined
          : // otherwise set active record to first that is still missing info
            firstStillMissingInformationRecord.id
      );
    }

    // otherwise, move to next record in the list
    setActiveRecordId(fixedRecordsForDisplayIds[activeRecordIdx + 1]);
  };

  if (childId) {
    return (
      <div className="grid-container">
        <BatchEditItemContent
          childId={childId}
          moveNextRecord={() => history.goBack()}
        />
      </div>
    );
  }

  return (
    <div className="grid-container">
      <BackButton text="Back to roster" location="/roster" />
      <h1 ref={h1Ref} className="margin-bottom-1">
        Add needed information
      </h1>
      {children.loading ? (
        <>Loading</>
      ) : (
        <>
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
              onClick: () => setActiveRecordId(record.id),
              title: (
                <span>
                  {nameFormatter(record)}
                  {!hasValidationError(record) && (
                    <InlineIcon icon="complete" />
                  )}
                </span>
              ),
              description: `Errors in ${getBatchEditErrorDetailsString(
                record
              )}`,
            }))}
          >
            {activeRecordId !== undefined ? (
              <BatchEditItemContent
                childId={activeRecordId}
                moveNextRecord={moveNextRecord}
              />
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
        </>
      )}
    </div>
  );
};

export default BatchEdit;
