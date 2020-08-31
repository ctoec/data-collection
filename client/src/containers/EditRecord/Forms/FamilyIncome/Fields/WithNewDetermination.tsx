import React, { useEffect, PropsWithChildren } from 'react';
import { FormContext, useGenericContext } from '@ctoec/component-library';
import produce from 'immer';
import { IncomeDetermination } from '../../../../../shared/models';
// import set from '@ctoec/component-library/lodash/set';

type WithNewDetermintionProps = {
  shouldCreate: boolean;
};
/**
 * A wrapping helper component that will optionally create a new determination (with id = 0).
 * Due to something funky with react's batch updates, the `updateData` call has no effect
 * when called normally. Workaround is to wrap it in a setTimeout call to force react to dispatch
 * the event.
 */
export const WithNewDetermination = ({
  shouldCreate = false,
  children: determinationFields,
}: PropsWithChildren<WithNewDetermintionProps>) => {
  const { data, dataDriller, updateData } = useGenericContext<
    IncomeDetermination
  >(FormContext);

  // Verify whether the family has a determination with ID 0
  // NOTE: Changed from the ECE Reporter implementation
  // to use different functions; logic is preserved
  // const hasNoZero = !(data.family.incomeDeterminations) ||
  //     (data.family.incomeDeterminations && data.family.incomeDeterminations)
  //     .findIndex((det) => det.id === 0) == -1;

  const newDet = dataDriller
    .at('family')
    .at('incomeDeterminations')
    .find((det) => det.id === 0);

  // Changed from ECE Reporter to not use the 'set' function
  // from 'lodash' package--logic is that if the family lacks
  // a determination with id 0, make a new determination for
  // them with that id and put it in their array of dets
  useEffect(() => {
    if (shouldCreate && newDet.value == undefined) {
      console.log(newDet);

      // Hacky way to make a copy of the object with a change
      // to the determination ID
      var detToAdd = JSON.parse(JSON.stringify(data));
      detToAdd.id = 0;

      // console.log(determinationFields);
      // console.log(detToAdd);
      // console.log(data);

      // Make a copy of existing det with the zero-id det
      // added so that we can statefully replace
      // const detToAdd = produce<IncomeDetermination>(data, (draft) => {
      //     const zeroDet = produce<IncomeDetermination>(data, (draft) => draft.id = 0);
      //     if (!draft.family.incomeDeterminations) {
      //         draft.family.incomeDeterminations = Array<IncomeDetermination>();
      //     }
      //     draft.family.incomeDeterminations.push(zeroDet);
      // });

      // Weird React workaround to force the update trigger
      setTimeout(() => updateData(detToAdd), 0);
    }
  }, [shouldCreate]);

  return <>{determinationFields}</>;
};
