import React, { useContext, useState } from 'react';
import { stringify } from 'query-string';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Modal,
  TextWithIcon,
  TrashCan,
} from '@ctoec/component-library';
import AuthenticationContext from '../../../contexts/AuthenticationContext/AuthenticationContext';
import { apiDelete } from '../../../utils/api';
import { Child } from '../../../shared/models';
import { RecordFormProps } from '../../../components/Forms';
import { nameFormatter } from '../../../utils/formatters';
import RosterContext from '../../../contexts/RosterContext/RosterContext';

type DeleteProps = {
  child: Child;
  setAlerts: RecordFormProps['setAlerts'];
};

export const DeleteRecord: React.FC<DeleteProps> = ({ child, setAlerts }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleIsOpen = () => setIsOpen((o) => !o);

  const { accessToken } = useContext(AuthenticationContext);
  const history = useHistory();
  const [isDeleting, setIsDeleting] = useState(false);

  const { rosterQuery, updateCurrentRosterCache } = useContext(RosterContext);

  function deleteRecord() {
    setIsDeleting(true);
    apiDelete(`children/${child.id}`, { accessToken })
      .then(() => {
        updateCurrentRosterCache(child, { remove: true });
        toggleIsOpen();
        history.push({
          pathname: '/roster',
          search: stringify(rosterQuery || {}),
          state: {
            alerts: [
              {
                type: 'success',
                heading: 'Record deleted',
                text: `${nameFormatter(child, {
                  capitalize: true,
                })}'s record was deleted from your roster.`,
              },
            ],
          },
        });
      })
      .catch((err) => {
        console.error(err);
        setAlerts([
          {
            type: 'error',
            text: `Unable to delete ${nameFormatter(child, {
              firstOnly: true,
              capitalize: true,
            })}'s record`,
          },
        ]);
      })
      .finally(() => {
        setIsDeleting(false);
      });
  }

  return (
    <>
      <Button
        appearance="unstyled"
        onClick={toggleIsOpen}
        text={<TextWithIcon text="Delete record" Icon={TrashCan} />}
        className="margin-right-0"
      />
      <Modal
        isOpen={isOpen}
        onModalClose={toggleIsOpen}
        // Shorten to accomodate modal close button in a
        // nice looking way
        header={<h2>{`Delete enrollment for ${nameFormatter(child)}?`}</h2>}
        content={
          <>
            <div className="grid-row">
              <span>
                Deleting an enrollment record will permanently remove all of its
                data
              </span>
            </div>
            <div className="margin-top-4">
              <div className="grid-row flex-first-baseline space-between-4">
                <Button
                  appearance="outline"
                  onClick={toggleIsOpen}
                  text="No, cancel"
                />
                <Button
                  appearance={isDeleting ? 'outline' : 'default'}
                  onClick={deleteRecord}
                  text={
                    isDeleting ? 'Deleting record...' : 'Yes, delete record'
                  }
                />
              </div>
            </div>
          </>
        }
      />
    </>
  );
};
