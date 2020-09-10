import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import AuthenticationContext from '../../../contexts/AuthenticationContext/AuthenticationContext';
import { apiDelete } from '../../../utils/api';
import { Child } from '../../../shared/models';
import { Button } from '@ctoec/component-library';

type DeleteProps = {
  child: Child;
  toggleOpen: () => void;
};

export const DeleteRecord: React.FC<DeleteProps> = ({ child, toggleOpen }) => {
  const { accessToken } = useContext(AuthenticationContext);
  const history = useHistory();

  const [isDeleting, setIsDeleting] = useState(false);

  function deleteRecord() {
    setIsDeleting(true);
    apiDelete(`children/${child.id}`, { accessToken })
      // TODO: Swap this total hack out for the roster page
      // once we have that implemented
      .then(() => history.push('/check-data/1'))

      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        toggleOpen();
        setIsDeleting(false);
      });
  }

  return (
    <div className="grid-container">
      <div className="grid-row margin-top-2">
        <h2>
          Do you want to delete the enrollment for {child.firstName}{' '}
          {child.lastName}?
        </h2>
      </div>
      <div className="grid-row margin-top-2">
        <span>
          Deleting an enrollment record will permanently remove all of its data
        </span>
      </div>
      <div className="margin-top-4">
        <div className="grid-row flex-first-baseline space-between-4">
          <Button appearance="outline" onClick={toggleOpen} text="No, cancel" />
          <Button
            appearance={isDeleting ? 'outline' : 'default'}
            onClick={deleteRecord}
            text={isDeleting ? 'Deleting record...' : 'Yes, delete record'}
          />
        </div>
      </div>
    </div>
  );
};
