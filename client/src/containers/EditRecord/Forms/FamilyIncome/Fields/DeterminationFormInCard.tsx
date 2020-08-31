import React from 'react';
import { WithNewDetermination, IncomeDeterminationFieldSet } from '../Fields';
import {
  Button,
  FormSubmitButton,
  Form,
  ExpandCard,
} from '@ctoec/component-library';
import { IncomeDetermination } from '../../../../../shared/models';

/**
 * Type to hold the intermediary props that connect the high-
 * level / overall income determinatino form to the individual
 * form fields. This bridges the gap between operating on the
 * whole array of determinations and operating on a single
 * determination, which the individual fields do.
 */
type DeterminationFormInCardProps = {
  determinationId: number;
  formData: IncomeDetermination;
  onSubmit: (_: IncomeDetermination) => void;
  onCancel?: () => void;
};

/**
 * The single-determination form to be embedded in a
 * DeterminationFormInCard on the UpdateForm page.
 *
 * The component relies on determinationId to determine
 * which flavor of CardForm it is:
 * - determinationId = 0: displayed in a Card as the primary
 *      content to create a new determination
 * - determinationId != 0: displayed in a CardExpansion as
 *      the expanded context to edit an existing determination
 */
const DeterminationFormInCard: React.FC<DeterminationFormInCardProps> = ({
  determinationId,
  formData,
  onSubmit,
  onCancel,
}) => {
  // determinationId !== 0 means edit, not redetermination
  const isEditExpansion = determinationId !== 0;

  const cancelElement = !isEditExpansion ? (
    <Button
      text="Cancel"
      appearance="outline"
      onClick={() => {
        if (onCancel) onCancel();
      }}
    />
  ) : (
    <ExpandCard>
      <Button text="Cancel" appearance="outline" />
    </ExpandCard>
  );

  return (
    <Form<IncomeDetermination>
      id={`update-family-income-${determinationId}`}
      data={formData}
      onSubmit={onSubmit}
      className="usa-form"
    >
      <WithNewDetermination shouldCreate={!isEditExpansion}>
        <IncomeDeterminationFieldSet
          type={isEditExpansion ? 'edit' : 'redetermine'}
          determinationId={determinationId}
        />
      </WithNewDetermination>
      <div className="display-flex">
        <div>
          {cancelElement}
          <FormSubmitButton text={isEditExpansion ? 'Save' : 'Redetermine'} />
        </div>
      </div>
    </Form>
  );
};

export default DeterminationFormInCard;
