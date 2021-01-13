import { Button, Checkbox, TextInput } from '@ctoec/component-library';
import Divider from '@material-ui/core/Divider';
import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { BackButton } from '../../components/BackButton';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import UserContext from '../../contexts/UserContext/UserContext';
import { Revision } from '../../shared/models/db/Revision';
import { apiPost } from '../../utils/api';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';

const FUNDING_SPACE_FORM_TYPES = {
  infant: [
    'Child Day Care - Part Time',
    'Child Day Care - Full Time',
    'Child Day Care - Part Time/Full Time',
  ],
  preschool: [
    'Child Day Care - Part Time',
    'Child Day Care - Full Time',
    'Child Day Care - Part Time/Full Time',
    'School Readiness - Full Day',
    'School Readiness - School Day',
    'School Readiness - Part Day',
    'School Readiness - Extended Day',
    'Smart Start',
  ],
  school: [
    'Child Day Care - Part Time',
    'Child Day Care - Full Time',
    'Child Day Care - Part Time/Full Time',
  ],
  headstart: ['Some enrollments are funded by the State Headstart Supplement'],
};

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
  const [revisionRequest, setRevisionRequest] = useState<any>({
    siteNameChanges: [],
    newSiteName: '',
    newSiteLicense: '',
    newSiteLicenseExempt: false,
    newSiteNaeycId: '',
    newSiteIsHeadstart: false,
    newSiteNoNaeyc: false,
    newSiteRegistryId: '',
    fundingSpaceTypes: [],
  });

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
                  const changeReq = `CHANGE ${s.siteName} TO ${e.target.value}`;
                  setRevisionRequest((o: any) => {
                    let newSites = o.siteNameChanges.filter(
                      (elt: string) => !elt.includes(s.siteName)
                    );
                    newSites.push(changeReq);
                    o.siteNameChanges = newSites;
                    return o;
                  });
                  return e.target.value;
                }}
              />
            </div>
            <div className="tablet:grid-col-3 display-flex flex-align-center">
              <Checkbox
                id={`${s.siteName}-remove-checkbox`}
                text=""
                onChange={(e) => {
                  const checked = e.target.checked;
                  const changeReq = `REMOVE ${s.siteName}`;
                  setRevisionRequest((o: any) => {
                    let newSites = o.siteNameChanges.filter(
                      (elt: string) => !elt.includes(s.siteName)
                    );
                    if (checked) newSites.push(changeReq);
                    o.siteNameChanges = newSites;
                    return o;
                  });
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

  // Generate the checkboxes for whether a user wishes to modify
  // their org's access to particular funding spaces
  const getFundingSpaceCheckbox = (ageGroup: string, space: string) => {
    return (
      <Checkbox
        id={`funding-space-check-${ageGroup}-${space}`}
        text={space}
        onChange={(e) => {
          const checked = e.target.checked;
          const spaceUpdate = `${ageGroup} ${space}`;
          setRevisionRequest((o: any) => {
            let newSpaces = o.fundingSpaceTypes.filter(
              (elt: string) => elt !== spaceUpdate
            );
            if (checked) newSpaces.push(spaceUpdate);
            o.fundingSpaceTypes = newSpaces;
            return o;
          });
          return checked;
        }}
      />
    );
  };

  // Send the accumulated changes to be written to the DB
  const submitRequest = (_revision: Revision) => {
    apiPost(`revision-request/${userOrgs[0].id}`, revisionRequest, {
      accessToken,
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
        <TextInput
          label="New site name"
          id="New-site-name"
          type="input"
          onChange={(e) => {
            setRevisionRequest((o: any) => {
              o.newSiteName = e.target.value;
              return o;
            });
            return e.target.value;
          }}
        />
        <TextInput
          label="License ID"
          id="New-site-license"
          type="input"
          onChange={(e) => {
            setRevisionRequest((o: any) => {
              o.newSiteLicense = e.target.value;
              return o;
            });
            return e.target.value;
          }}
        />
        <Checkbox
          id="new-site-license-exempt-check"
          text="This site is license exempt"
          onChange={(e) => {
            setRevisionRequest((o: any) => {
              o.newSiteLicenseExempt = e.target.checked;
              return o;
            });
            return e.target.checked;
          }}
        />
        <TextInput
          label="NAEYC ID"
          id="New-site-naeyc"
          type="input"
          onChange={(e) => {
            setRevisionRequest((o: any) => {
              o.newSiteNaeycId = e.target.value;
              return o;
            });
            return e.target.value;
          }}
        />
        <Checkbox
          id="new-site-headstart-check"
          text="Headstart"
          onChange={(e) => {
            setRevisionRequest((o: any) => {
              o.newSiteIsHeadstart = e.target.checked;
              return o;
            });
            return e.target.checked;
          }}
        />
        <Checkbox
          id="new-site-no-naeyc-check"
          text="New - Doesn't have NAEYC ID yet"
          onChange={(e) => {
            setRevisionRequest((o: any) => {
              o.newSiteNoNaeyc = e.target.checked;
              return o;
            });
            return e.target.checked;
          }}
        />
        <TextInput
          label="Registry ID"
          id="New-site-registry"
          type="input"
          onChange={(e) => {
            const change = e.target.value;
            setRevisionRequest((o: any) => {
              o.newSiteRegistryId = change;
              return o;
            });
            return change;
          }}
        />
      </div>
      <div className="tablet:grid-col-6 margin-top-4 margin-bottom-4">
        <Divider />
      </div>
      <div className="tablet:grid-col-6">
        <h2>Funding space types</h2>
        <p className="usa-hint">
          Request correction to the funding types received by your program in
          the section below.
        </p>
        <p className="text-bold">Infant/toddler</p>
        {FUNDING_SPACE_FORM_TYPES.infant.map((type) =>
          getFundingSpaceCheckbox('Infant/toddler', type)
        )}
        <p className="text-bold">Preschool</p>
        {FUNDING_SPACE_FORM_TYPES.preschool.map((type) =>
          getFundingSpaceCheckbox('Preschool', type)
        )}
        <p className="text-bold">School aged</p>
        {FUNDING_SPACE_FORM_TYPES.school.map((type) =>
          getFundingSpaceCheckbox('School aged', type)
        )}
        <p className="text-bold">State Headstart</p>
        {FUNDING_SPACE_FORM_TYPES.headstart.map((type) =>
          getFundingSpaceCheckbox('Headstart', type)
        )}
      </div>
      <div className="grid-row grid-gap margin-top-2 margin-bottom-2">
        <Button appearance="unstyled" text="Cancel" href="/home" />
        <Button
          appearance="default"
          text="Send request"
          onClick={() => submitRequest(revisionRequest)}
        />
      </div>
    </div>
  );
};
