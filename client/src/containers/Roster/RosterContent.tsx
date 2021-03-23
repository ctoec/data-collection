import React from 'react';
import { Accordion, AccordionProps } from '@ctoec/component-library';
import { stringify } from 'query-string';
import { Link, useHistory } from 'react-router-dom';
import { NoRecordsAlert } from './NoRecordsAlert';
import { RosterQueryParams } from '../../contexts/RosterContext/RosterContext';
import { Child } from '../../shared/models';

export type RosterContentProps = {
  query: RosterQueryParams;
  accordionProps?: AccordionProps;
  childRecords?: Child[];
};

export const RosterContent: React.FC<RosterContentProps> = ({
  query,
  childRecords,
  accordionProps,
}) => {
  const history = useHistory();
  if (childRecords?.length && accordionProps?.items.length) {
    return <Accordion {...accordionProps} />;
  }

  // If withdrawn and no child records
  if (query.withdrawn) {
    // Default for no children and show only withdrawn
    return (
      <div className="margin-top-4 margin-bottom-4">
        <div className="font-body-lg margin-bottom-2">
          You have no withdrawn enrollments
        </div>
        {/* TODO: we're doing a lot of sketchy buttons-that-go-somewhere stuff, and they should probably all be links */}
        <Link
          to={{
            ...history.location,
            search: stringify({ ...query, withdrawn: undefined }),
          }}
        >
          Return to current roster
        </Link>
      </div>
    );
  }

  // If there are no records and we're not just looking at withdrawn children
  return <NoRecordsAlert />;
};
