import React, { useContext, useState, useEffect } from 'react';
import qs from 'query-string';
import {
  Modal,
  CheckboxGroup,
  Checkbox,
  CheckboxOption,
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
        ? `?${qs.stringify({ overwriteSites: siteIdsToReplace })}`
        : ''
    );
  }, [siteIdsToReplace]);

  const options: CheckboxOption[] = [
    // All sites option
    {
      value: 'all',
      render: (props) => (
        <Checkbox
          {...props}
          checked={siteIdsToReplace.length === 0}
          id="all-sites"
          text="All sites"
          onChange={(e) => {
            if (e.target.checked) {
              setSiteIdsToReplace([]);
            }
          }}
        />
      ),
    },
    ...(user?.sites || []).map(
      (site) =>
        ({
          value: `${site.id}`,
          render: (props) => (
            <Checkbox
              {...props}
              value={`${site.id}`}
              checked={siteIdsToReplace.includes(site.id)}
              id={`site-${site.id}`}
              text={site.siteName}
              onChange={(e) => {
                const siteId = parseInt(e.target.value);
                if (e.target.checked) {
                  setSiteIdsToReplace((ids) => [...ids, siteId]);
                } else {
                  setSiteIdsToReplace((ids) =>
                    ids.filter((id) => id !== siteId)
                  );
                }
              }}
            />
          ),
        } as CheckboxOption)
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
            horizontal
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
