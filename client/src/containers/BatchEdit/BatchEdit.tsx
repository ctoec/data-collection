import React, { useContext, useState, useEffect } from 'react';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import {
  SideNav,
  TextWithIcon,
  Success,
  Button,
  ArrowRight,
  InlineIcon,
} from '@ctoec/component-library';
import { BackButton } from '../../components/BackButton';
import DataCacheContext from '../../contexts/DataCacheContext/DataCacheContext';
import { Child } from '../../shared/models';
import { hasValidationError } from '../../utils/hasValidationError';
import pluralize from 'pluralize';
import { nameFormatter } from '../../utils/formatters';
import { Link } from 'react-router-dom';

const BatchEdit: React.FC = () => {
  const h1Ref = getH1RefForTitle();
  const { children } = useContext(DataCacheContext);

  const [allRecords, setAllRecords] = useState<Child[]>([]);
  useEffect(() => {
    if (!children.loading) {
      setAllRecords(children.records.filter(hasValidationError));
    }
  }, [children.loading]);
  const missingInformationRecordsCount = allRecords.filter(hasValidationError)
    .length;

  const [activeRecordIdx, setActiveRecordIdx] = useState<number>();
  useEffect(() => {
    if (allRecords.length) setActiveRecordIdx(0);
  }, [allRecords.length]);

  const moveNextRecord = () => {
    // If active record is last record in the list
    if (activeRecordIdx === allRecords.length - 1) {
      // Then look for the first record that is still missing info
      const firstStillMissingInformationRecordIdx = allRecords.findIndex(
        hasValidationError
      );

      setActiveRecordIdx(
        // If a no records are missing info, then set active record to none
        firstStillMissingInformationRecordIdx < 0
          ? undefined
          : // otherwise set active record to first that is still missing info
            firstStillMissingInformationRecordIdx
      );
    }

    // otherwise, move to next record in the list
    setActiveRecordIdx((idx) => (idx === undefined ? idx : idx + 1));
  };

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
          <p className="display-flex font-body-lg height-5 line-height-body-6 margin-y-0">
            {missingInformationRecordsCount ? (
              <>
                <div className="text-white text-bold text-center bg-primary width-5 radius-pill margin-right-1">
                  {missingInformationRecordsCount}
                </div>
                {pluralize('record', missingInformationRecordsCount)}{' '}
                {pluralize('has', missingInformationRecordsCount)} missing or
                incomplete info required to submit your data
              </>
            ) : (
              <>
                {/* TODO make it possible to make this icon big */}
                <InlineIcon className="height-4 width-4" icon="complete" /> All
                enrollments are complete
              </>
            )}
          </p>
          <SideNav
            externalActiveItemIndex={activeRecordIdx}
            items={allRecords.map((record) => ({
              title: (
                <span>
                  {nameFormatter(record)}
                  {!hasValidationError(record) && (
                    <InlineIcon icon="complete" />
                  )}
                </span>
              ),
              description: 'Placeholder',
              content: <div>PLACEHOLDER </div>,
            }))}
            noActiveItemContent={
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
            }
          />
        </>
      )}
    </div>
  );
};

export default BatchEdit;
