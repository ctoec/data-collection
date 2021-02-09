import { Button, Checkbox, TextInput } from '@ctoec/component-library';
import Divider from '@material-ui/core/Divider';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { BackButton } from '../../components/BackButton';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import UserContext from '../../contexts/UserContext/UserContext';
import { FUNDING_SOURCE_TIMES } from '../../shared/constants';
import { AgeGroup, FundingSpace, Site } from '../../shared/models';
import { AddSiteRequest } from '../../shared/models/db/AddSiteRequest';
import { ChangeFundingSpaceRequest } from '../../shared/models/db/ChangeFundingSpaceRequest';
import { UpdateSiteRequest } from '../../shared/models/db/UpdateSiteRequest';
import { apiGet, apiPost } from '../../utils/api';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { getAddNewSiteForm } from './utils/getAddNewSiteForm';
import { getFundingSpaceCheckboxes } from './utils/getFundingSpaceCheckboxes';

/**
 * Form to allow a user to request changes to their accessible sites
 * and/or funding spaces. FormField elements aren't used here because
 * we're not modifying an existing DB entity, only accumulating
 * information that we'll shove into a new row in the revisions
 * table.
 */
export const RevisionRequest: React.FC = () => {
  const { user } = useContext(UserContext);
  const userOrgs = user?.organizations || [];
  const { accessToken } = useContext(AuthenticationContext);
  const history = useHistory();
  const h1Ref = getH1RefForTitle();

  const userSites = user?.sites || [];
  const [updateRequests, setUpdateRequests] = useState<UpdateSiteRequest[]>([]);
  useEffect(() => {
    if (user) {
      // Store all the sites the user works with in local state
      // so that we can easily modify them and send a single
      // change map to the backend
      const mappedSites = userSites.map(
        (s) =>
          ({
            siteId: s.id,
            newName: '',
            remove: false,
          } as UpdateSiteRequest)
      );
      setUpdateRequests(mappedSites);
    }
  }, [user]);

  const [addRequests, setAddRequests] = useState<AddSiteRequest[]>([]);

  // Start by determining all potential funding spaces so we know what
  // we need to precheck
  const [userFundingSpaces, setUserFundingSpaces] = useState<
    ChangeFundingSpaceRequest[]
  >([]);
  useEffect(() => {
    const fsOptions: ChangeFundingSpaceRequest[] = [];
    Object.values(AgeGroup).map((ag) => {
      FUNDING_SOURCE_TIMES.forEach((fst) => {
        if (!fst.ageGroupLimitations || fst.ageGroupLimitations.includes(ag)) {
          fst.fundingTimes.forEach((time) => {
            const stringRep = ag + ' - ' + fst.displayName + ' - ' + time.value;
            fsOptions.push({
              fundingSpace: stringRep,
              shouldHave: false,
            } as ChangeFundingSpaceRequest);
          });
        }
      });
    });
    setUserFundingSpaces(fsOptions);
  }, []);

  // Now fetch all the funding spaces that the user and their org
  // have access to, and when we generate the funding space
  // checkboxes on the page, mark all these as true
  const [fundingCheckboxes, setFundingCheckboxes] = useState<JSX.Element[]>([]);
  useEffect(() => {
    if (user && accessToken && userFundingSpaces.length !== 0) {
      apiGet('funding-spaces', accessToken)
        .then((res: FundingSpace[]) => {
          res.forEach((fs) => {
            const stringRep =
              fs.ageGroup +
              ' - ' +
              fs.source.split('-')[1].trim() +
              ' - ' +
              fs.time;
            const match = userFundingSpaces.find(
              (fs) => fs.fundingSpace === stringRep
            );
            if (match) {
              setUserFundingSpaces((o) => {
                match.shouldHave = true;
                return o;
              });
            }
          });
          setFundingCheckboxes(
            getFundingSpaceCheckboxes(userFundingSpaces, setUserFundingSpaces)
          );
        })
        .catch((err) => {
          throw new Error(err);
        });
    }
  }, [user, accessToken, userFundingSpaces.length]);

  const updateSite = (
    s: Site,
    opts?: {
      updatedName?: string;
      removeSite?: boolean;
    }
  ) => {
    const { updatedName, removeSite } = opts || {};
    setUpdateRequests((o) => {
      const site = updateRequests.find((_site) => _site.siteId === s.id);
      if (site && updatedName) site.newName = updatedName;
      if (site && removeSite) site.remove = removeSite;
      return o;
    });
  };

  // Create the nice tabular format of sites the user has
  // access to, along with the text input fields in which
  // they can change those site names, plus the checkboxes
  // to request no longer needing that site
  const siteSection = (
    <>
      <div className="grid-row grid-gap margin-bottom-1">
        <div className="tablet:grid-col-4 text-bold">Site name</div>
        <div className="tablet:grid-col-3 text-bold">Request updated name</div>
        <div className="tablet:grid-col-3 text-bold">
          Request removal from your account
        </div>
      </div>
      {(user?.sites || []).map((s) => (
        <>
          <div className="grid-row grid-gap margin-bottom-1">
            <div className="tablet:grid-col-4">
              <p>{s.siteName}</p>
              <p className="usa-hint">
                <b>License #: </b> {` ${s.licenseNumber || 'Exempt'} `}{' '}
                <b>NAEYC ID: </b> {` ${s.naeycId || 'None'} `}{' '}
                <b>Registry ID: </b> {` ${s.registryId || 'None'} `}
              </p>
            </div>
            <div className="tablet:grid-col-3 display-flex flex-align-center">
              <TextInput
                label=""
                id={`${s.siteName}-rename`}
                type="input"
                onChange={(e) => {
                  const change = e.target.value;
                  updateSite(s, { updatedName: change });
                  return change;
                }}
              />
            </div>
            <div className="tablet:grid-col-3 display-flex flex-align-center">
              <Checkbox
                id={`${s.siteName}-remove-checkbox`}
                text=""
                onChange={(e) => {
                  const checked = e.target.checked;
                  updateSite(s, { removeSite: checked });
                  return checked;
                }}
              />
            </div>
          </div>
          <div className="tablet:grid-col-10 margin-top-1 margin-bottom-1">
            <Divider />
          </div>
        </>
      ))}
    </>
  );

  // Add another set of new site fields to the revision form
  const addNewSite = () => {
    const newSite = {
      siteName: '',
      licenseId: '',
      naeycId: '',
      registryId: '',
    } as AddSiteRequest;
    setAddRequests((o) => {
      return [...o, newSite];
    });
  };

  const addSiteSection = addRequests.map((addReq, idx) =>
    getAddNewSiteForm(addReq, idx, setAddRequests)
  );

  // Send the accumulated changes to be written to the DB
  const submitRequest = () => {
    const revisionRequest = {
      updateSiteRequests: updateRequests.filter(
        (r) => r.newName !== '' || r.remove
      ),
      addSiteRequests: addRequests.filter(
        (r) => r.siteName && r.siteName !== ''
      ),
      fundingSpaceRequests: userFundingSpaces,
    };
    apiPost(`revision-request/${userOrgs[0].id}`, revisionRequest, {
      accessToken,
      jsonParse: false,
    }).catch((err) => {
      throw new Error(err);
    });
    history.push('/home', {
      alerts: [
        {
          type: 'success',
          heading: 'Request received!',
          text:
            'The ECE Reporter team will send any questions and status updates to the email associated with your ECE Reporter account.',
        },
      ],
    });
  };

  return (
    <div className="grid-container margin-top-4">
      <BackButton />
      <h1 ref={h1Ref}>Request site and funding changes</h1>
      <p>
        The ECE Reporter team will review any requested updates made in this
        form. Any updates or follow-up questions will be sent to the email
        associated with your ECE Reporter account.
      </p>
      <h2>Managed sites</h2>
      {siteSection}
      <div className="tablet:grid-col-6">
        <h2>Request a new site</h2>
        <p className="usa-hint">
          Fill out this section if your program manages a site not included in
          your ECE Reporter account.
        </p>
        {addSiteSection}
        <Button appearance="default" text="Add New Site" onClick={addNewSite} />
      </div>
      <div className="tablet:grid-col-6 margin-top-4 margin-bottom-4">
        <Divider />
      </div>
      <div className="tablet:grid-col-6">
        <h2>Funding space types</h2>
        <p className="usa-hint">
          Request corrections to the funding types received by your program in
          the section below.
        </p>
        {fundingCheckboxes}
      </div>
      <div className="grid-row grid-gap margin-top-2 margin-bottom-2">
        <Button appearance="outline" text="Cancel" href="/home" />
        <Button
          appearance="default"
          text="Send request"
          onClick={submitRequest}
        />
      </div>
    </div>
  );
};
