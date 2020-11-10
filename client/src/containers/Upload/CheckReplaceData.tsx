import React, { useContext, useState, useEffect } from 'react';
import { stringify } from 'query-string';
import {
  Modal,
  CheckboxGroup,
  CheckboxInGroup,
  Button,
} from '@ctoec/component-library';
import UserContext from '../../contexts/UserContext/UserContext';

type CheckReplaceDataProps = {
  isOpen: boolean;
  toggleIsOpen: () => void;
  clearFile: () => void;
  setPostUpload: (_: boolean) => void;
  setQueryString: (_: string) => void;
};
export const CheckReplaceData: React.FC<CheckReplaceDataProps> = ({
  isOpen,
  toggleIsOpen,
  clearFile,
  setPostUpload,
  setQueryString,
}) => {
  const { user } = useContext(UserContext);
  const [siteIdsToReplace, setSiteIdsToReplace] = useState<number[]>([]);

  useEffect(() => {
    setQueryString(
      siteIdsToReplace.length
        ? `?${stringify({ overwriteSites: siteIdsToReplace })}`
        : ''
    );
  }, [siteIdsToReplace]);

  const options: CheckboxInGroup[] = [
    // All sites option
    {
      id: 'all-sites',
      text: 'All sites',
      value: 'all',
      checked: siteIdsToReplace.length === 0,
      onChange: (e) => {
        if (e.target.checked) {
          setSiteIdsToReplace([]);
        }
      },
    },
    // If it's a single-site user of a multi-site provider, user
    // should already be access-limited to only be able to replace
    // the one site they have access to
    ...(user?.sites || []).map(
      (site): CheckboxInGroup => ({
        value: `${site.id}`,
        checked: siteIdsToReplace.includes(site.id),
        id: `site-${site.id}`,
        text: site.siteName,
        onChange: (e) => {
          const siteId = parseInt(e.target.value);
          if (e.target.checked) {
            setSiteIdsToReplace((ids) => [...ids, siteId]);
          } else {
            setSiteIdsToReplace((ids) => ids.filter((id) => id !== siteId));
          }
        },
      })
    ),
  ];

  return (
    <Modal
      isOpen={isOpen}
      toggleOpen={toggleIsOpen}
      header={<h2> Do you want to replace your existing data? </h2>}
      showHeaderBorder
      content={
        <div>
          <p>
            When this file is uploaded, all of your existing data will be
            overwritten.
          </p>
          <p>
            If this upload is only meant to replace data for specific sites,
            choose them below:
          </p>

          <CheckboxGroup
            id="replace-data-sites"
            legend="Choose sites"
            showLegend
            childrenGroupClassName="grid-col"
            options={options}
          />

          <div className="margin-top-2">
            <Button
              appearance="outline"
              text="Cancel"
              onClick={() => {
                clearFile();
                toggleIsOpen();
              }}
            />
            <Button
              text="Replace data"
              onClick={() => {
                setPostUpload(true);
                toggleIsOpen();
              }}
            />
          </div>
        </div>
      }
    />
  );
};
