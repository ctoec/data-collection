import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import AuthenticationContext from '../../../contexts/AuthenticationContext/AuthenticationContext';
import { apiDelete } from '../../../utils/api';
import { Child } from '../../../shared/models';
import { Button, Modal } from '@ctoec/component-library';
import { useAuthenticatedSWR } from '../../../hooks/useAuthenticatedSWR';
import { stringify } from 'querystring';

type DeleteProps = {
  child: Child;
};

export const DeleteRecord: React.FC<DeleteProps> = ({ child }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleIsOpen = () => setIsOpen((o) => !o);

  const { accessToken } = useContext(AuthenticationContext);
  const { mutate } = useAuthenticatedSWR(
    `children?${stringify({ organizationId: child.organization.id })}`
  );
  const history = useHistory();

  const [isDeleting, setIsDeleting] = useState(false);

  function deleteRecord() {
    setIsDeleting(true);
    apiDelete(`children/${child.id}`, { accessToken })
      .then(() => {
        toggleIsOpen();
        mutate((children: Child[]) => {
          if (children) return [...children.filter((c) => c.id !== child.id)];
          return children;
        });
        history.push('/roster', {
          alerts: [
            {
              type: 'success',
              heading: 'Record deleted',
              text: `${child.firstName} ${child.lastName}'s record was deleted from your roster.`,
            },
          ],
        });
      })
      .catch((err) => {
        console.log(err);
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
        text="Delete record"
        className="margin-right-0"
      />
      <Modal
        isOpen={isOpen}
        toggleOpen={toggleIsOpen}
        // Shorten to accomodate modal close button in a
        // nice looking way
        header={
          <h2>
            Delete enrollment for {`${child.firstName} ${child.lastName}`}?
          </h2>
        }
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