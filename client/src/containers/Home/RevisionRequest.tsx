import {
  Alert,
  Button,
  Checkbox,
  Form,
  Pencil,
  TextInput,
  TextWithIcon,
} from '@ctoec/component-library';
import Divider from '@material-ui/core/Divider';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BackButton } from '../../components/BackButton';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import UserContext from '../../contexts/UserContext/UserContext';
import { ReactComponent as Image } from '../../images/PersonWithSpreadsheet.svg';
import { Site } from '../../shared/models';
import { Revision } from '../../shared/models/db/Revision';
import { apiGet } from '../../utils/api';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { HowToUseStep } from './HowToUseStep';
import { mapFundingSpacesToCards } from './mapFundingSpacesToCards';
import { SiteName } from './revisionFields/SiteName';

export const RevisionRequest: React.FC = () => {
  const { user } = useContext(UserContext);
  const userOrgs = user?.organizations || [];
  const { accessToken } = useContext(AuthenticationContext);
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
  const [editingSite, setEditingSite] = useState<Site | null>(null);

  // useEffect(() => {
  //   apiGet(`funding-spaces/${userOrgs[0].id}`, accessToken)
  //     .then((res) => {
  //       setRevisionRequest((o: any) => {
  //         o.fundingSpaceTypes = res;
  //       })
  //     })
  //     .catch((err) => {
  //       throw new Error(err);
  //     });
  // }, [user, accessToken]);

  console.log(revisionRequest);

  const siteEdit = () => {
    if (editingSite === null) return <></>;
    return <SiteName editingSite={editingSite} />;
  };

  return (
    <div className="grid-container margin-top-4">
      <BackButton />
      <Form<Revision> data={revisionRequest} onSubmit={() => {}}>
        <h1 ref={h1Ref}>Request site and funding changes</h1>
        <p>
          The ECE Reporter team will review any requested updates made in this
          form. Any updates or follow-up questions will be sent to the email
          associated with your ECE Reporter account.
        </p>
        <h2>Managed sites</h2>
        {user?.sites?.map((s) => (
          <>
            <div className="grid-row grid-gap margin-bottom-1">
              <div className="tablet:grid-col-3">{s.siteName}</div>
              <div className="tablet:grid-col-3">
                <Button
                  text={<TextWithIcon text="Request updates" Icon={Pencil} />}
                  appearance="unstyled"
                  onClick={() => setEditingSite(s)}
                />
              </div>
            </div>
            <div className="tablet:grid-col-6 margin-top-1 margin-bottom-1">
              <Divider />
            </div>
          </>
        ))}
        {siteEdit()}
        <div className="tablet:grid-col-6 margin-top-4 margin-bottom-4">
          <Divider />
        </div>
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
        </div>
      </Form>
    </div>
  );
};
