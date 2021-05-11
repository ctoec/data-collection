import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import UserContext from '../../contexts/UserContext/UserContext';
import { useAuthenticatedSWR } from '../../hooks/useAuthenticatedSWR';
import { SummaryResponse } from '../../shared/payloads/SummaryResponse';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { SummaryCard } from './SummaryCard';
import { SiteSummaryTabNav } from './SiteSummaryTabNav';
import pluralize from 'pluralize';
import { Button } from '@ctoec/component-library';

const Overview: React.FC = () => {
  const { user } = useContext(UserContext);
  const h1Ref = getH1RefForTitle();

  const {
    data: {
      totalChildren,
      totalOrganizations,
      totalProviderUsers,
      siteSummaries: { completedSites, inProgressSites, noDataSites } = {
        completedSites: [],
        inProgressSites: [],
        noDataSites: [],
      },
    } = {},
  } = useAuthenticatedSWR<SummaryResponse>('summary');

  const totalSites =
    completedSites.length + inProgressSites.length + noDataSites.length;

  return !user?.isAdmin ? (
    <Redirect to="/home" />
  ) : (
    <div className="grid-container">
      <div className="grid-row grid-gap">
        <div className="tablet:grid-col-12 margin-top-4 margin-bottom-2">
          <h1 ref={h1Ref} className="margin-top-0">
            ECE Reporter Overview
          </h1>
          <p className="font-body-lg">
            {totalChildren} children enrolled across {totalSites} sites with
            data
          </p>
          <Button text="Create new organization" href="/create-org" />
        </div>
        <div className="tablet:grid-col-12 margin-bottom-2">
          <h2>Onboarding Summary</h2>
          <div className="display-flex flex-row ">
            <SummaryCard
              header="Accounts created"
              body={`${totalProviderUsers}`}
            />
            <SummaryCard
              header="Organizations"
              body={`${totalOrganizations}`}
            />
            <SummaryCard header="Sites" body={`${totalSites}`} />
          </div>
          <div className="display-flex flex-row ">
            <SummaryCard
              header="Complete Dec-July request"
              body={
                <>
                  {completedSites.length}
                  <span className="font-body-lg">
                    {pluralize(' site', completedSites.length)}
                  </span>
                </>
              }
            />
            <SummaryCard
              header="In progress"
              body={
                <>
                  {inProgressSites.length}
                  <span className="font-body-lg">
                    {pluralize(' site', inProgressSites.length)}
                  </span>
                </>
              }
            />
            <SummaryCard
              header="No data entered"
              body={
                <>
                  {noDataSites.length}
                  <span className="font-body-lg">
                    {pluralize(' site', noDataSites.length)}
                  </span>
                </>
              }
            />
          </div>
        </div>

        <div className="tablet:grid-col-12">
          <h2>Data status by site</h2>
          <SiteSummaryTabNav
            completedSites={completedSites}
            inProgressSites={inProgressSites}
            noDataSites={noDataSites}
          />
        </div>
      </div>
    </div>
  );
};

export default Overview;
