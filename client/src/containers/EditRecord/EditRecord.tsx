import React, { useState, useContext, useEffect } from 'react';
import { useParams, useLocation, useHistory, Link } from 'react-router-dom';
import {
  AlertProps,
  ErrorBoundary,
  LoadingWrapper,
  TabNav,
} from '@ctoec/component-library';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { apiGet } from '../../utils/api';
import { BackButton } from '../../components/BackButton';
import { WithdrawRecord } from './WithdrawRecord/WithdrawRecord';
import { DeleteRecord } from './DeleteRecord/DeleteRecord';
import { useAlerts } from '../../hooks/useAlerts';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { useFocusFirstError } from '../../hooks/useFocusFirstError';
import { getTabItems, getTabContent } from './tabItems';
import {
  SECTION_KEYS,
  formSections,
} from '../../components/Forms/formSections';
import { Child } from '../../shared/models';
import { defaultErrorBoundaryProps } from '../../utils/defaultErrorBoundaryProps';
import { HeadingLevel } from '../../components/Heading';
import RosterContext from '../../contexts/RosterContext/RosterContext';
import { nameFormatter } from '../../utils/formatters';
import { ChangeEnrollment } from './ChangeEnrollment/ChangeEnrollment';

const EditRecord: React.FC = () => {
  const h1Ref = getH1RefForTitle('Edit record');
  const { childId } = useParams() as {
    childId: string;
  };
  const { accessToken } = useContext(AuthenticationContext);
  const { alertElements, setAlerts } = useAlerts();
  const [child, setChild] = useState<Child>();

  // Persist active tab in URL hash
  const activeTab = useLocation().hash.slice(1);
  // Clear any previously displayed success alerts
  useEffect(() => {
    setAlerts((alerts) => [
      ...alerts.filter((alert) => alert?.type === 'error'),
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);
  const history = useHistory();
  // and make child tab active by default if no hash
  // (but only on first render)
  useEffect(() => {
    if (!activeTab) {
      history.replace({ hash: SECTION_KEYS.IDENT });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { updateCurrentRosterCache } = useContext(RosterContext);

  // Child re-fetch
  const [triggerRefetchCounter, setTriggerRefetchCounter] = useState(0);
  useEffect(() => {
    apiGet(`children/${childId}`, accessToken)
      .then((updatedChild) => {
        setChild(updatedChild);
        updateCurrentRosterCache(updatedChild);

        const newAlerts: AlertProps[] = [];
        const missingInfoAlertProps = getMissingInfoAlertProps(updatedChild);
        // Always set missing info alert, if one exists
        if (missingInfoAlertProps) {
          newAlerts.push(missingInfoAlertProps);
        }

        // TODO: remove this banner alert error, and replace with funding card with
        // missing info icons - https://github.com/ctoec/data-collection/pull/795#issuecomment-729150524
        const missingFundedEnrollmentAlertProps = getMissingFundedEnrollmentAlertProps(
          updatedChild
        );
        if (missingFundedEnrollmentAlertProps) {
          newAlerts.splice(0, 1, missingFundedEnrollmentAlertProps);
        }

        // Only set success alert on a GET that happens after an update (refetch count > 0)
        if (triggerRefetchCounter > 0) {
          newAlerts.push({
            type: 'success',
            heading: 'Record updated',
            text: `Your changes to ${nameFormatter(
              updatedChild
            )}'s record have been saved.`,
          });
        }
        setAlerts(newAlerts);
      })
      .catch((err) => {
        throw new Error(err);
      });
  }, [accessToken, childId, triggerRefetchCounter]);

  useFocusFirstError([child]);

  const commonFormProps = {
    child,
    afterSaveSuccess: () => setTriggerRefetchCounter((r) => r + 1),
    setAlerts,
    topHeadingLevel: 'h2' as HeadingLevel,
  };
  const activeEnrollment = (child?.enrollments || []).find((e) => !e.exit);
  return (
    <div className="grid-container">
      <BackButton />
      {alertElements}
      <div className="display-flex flex-justify">
        <div>
          <h1 ref={h1Ref} className="margin-top-0">
            <span className="h2 h2--lighter">Edit record </span>
            {child
              ? `${nameFormatter(child, { capitalize: true })}`
              : 'Loading...'}
          </h1>
        </div>
        {child && (
          <div className="display-flex flex-col flex-align-center">
            {/* TODO: STYLE & ICONS */}
            <span className="margin-right-2">Quick actions</span>
            <ChangeEnrollment
              child={child}
              currentEnrollment={activeEnrollment}
            />
            {!!activeEnrollment && (
              <>
                <WithdrawRecord child={child} enrollment={activeEnrollment} />
              </>
            )}
            <DeleteRecord child={child} setAlerts={setAlerts} />
          </div>
        )}
      </div>
      <div className="grid-col">
        <LoadingWrapper loading={!child}>
          <TabNav
            items={getTabItems(commonFormProps)}
            activeId={activeTab}
            onClick={(tabId) => {
              history.replace({ hash: tabId });
            }}
          >
            <ErrorBoundary alertProps={{ ...defaultErrorBoundaryProps }}>
              {child ? getTabContent(activeTab, commonFormProps) : <></>}
            </ErrorBoundary>
          </TabNav>
        </LoadingWrapper>
      </div>
    </div>
  );
};

const MISSING_INFO_ALERT_HEADING = 'This record has missing or incorrect info';
const getMissingInfoAlertProps: (child: Child) => AlertProps | undefined = (
  child: Child
) => {
  const formsWithErrors = formSections.filter((section) =>
    section.hasError(child)
  );
  if (!formsWithErrors.length) return;

  return {
    heading: MISSING_INFO_ALERT_HEADING,
    type: 'error',
    text: `Add required info in ${formsWithErrors
      .map((form) => form.name.toLowerCase())
      .join(', ')} before submitting your data to OEC.`,
  };
};

const getMissingFundedEnrollmentAlertProps: (
  _: Child
) => AlertProps | undefined = (child: Child) => {
  const missingFundingError = child.validationErrors?.find(
    (err) =>
      err.property === 'enrollments' &&
      err.constraints &&
      err.constraints['fundedEnrollment']
  );

  if (missingFundingError) {
    return {
      type: 'error',
      heading: 'This record is missing funding information',
      text: (
        <>
          Records must have at least one current or past funded enrollment to be
          submitted to OEC. Add funding info in the{' '}
          <Link to={`/edit-record/${child.id}#${SECTION_KEYS.ENROLLMENT}`}>
            enrollment and funding section
          </Link>
        </>
      ),
    };
  }
};

export default EditRecord;
