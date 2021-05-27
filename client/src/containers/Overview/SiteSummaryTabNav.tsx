import React, { useState } from 'react';
import { TabNav } from '@ctoec/component-library';
import { SiteSummaryTable } from './SiteSummaryTable';
import { SiteSummary } from '../../shared/payloads/SummaryResponse';

type DataStatusTabNavProps = {
  completedSites: SiteSummary[];
  inProgressSites: SiteSummary[];
  noDataSites: SiteSummary[];
};

enum SITE_TYPE {
  COMPLETED = 'completed',
  IN_PROGRESS = 'in-progress',
  NO_DATA = 'no-data',
}

export const SiteSummaryTabNav: React.FC<DataStatusTabNavProps> = ({
  completedSites,
  inProgressSites,
  noDataSites,
}) => {
  const [activeTab, setActiveTab] = useState<SITE_TYPE>(SITE_TYPE.COMPLETED);
  return (
    <TabNav
      activeId={activeTab}
      onClick={(tabId) => setActiveTab(tabId as SITE_TYPE)}
      items={[
        {
          id: 'completed',
          tabText: `Completed (${completedSites.length})`,
        },
        {
          id: 'in-progress',
          tabText: `In progress (${inProgressSites.length})`,
        },
        {
          id: 'no-data',
          tabText: `No data entered (${noDataSites.length})`,
        },
      ]}
    >
      {activeTab === SITE_TYPE.COMPLETED ? (
        <SiteSummaryTable
          headerText="completed January to May data"
          sites={completedSites}
          showSubmissionDate
        />
      ) : activeTab === SITE_TYPE.IN_PROGRESS ? (
        <SiteSummaryTable
          headerText="in-progress January to May data"
          sites={inProgressSites}
        />
      ) : (
        <SiteSummaryTable
          headerText="no data entered"
          sites={noDataSites}
          hideEnrollments
        />
      )}
    </TabNav>
  );
};
