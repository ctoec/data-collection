import React, { useEffect, PropsWithChildren } from 'react';
import { FormContext, useGenericContext } from '@ctoec/component-library';
import { IncomeDetermination } from '../../../../../shared/models';

/**
 * Prop type to hold a basic flag on whether we're making a new
 * income determination or not.
 */
type WithNewDetermintionProps = {
  shouldCreate: boolean;
};
/**
 * Helper component that decides (based on input) whether we're
 * making a new determination (with id = 0) or not.
 * Due to something funky with react's batch updates, the
 * `updateData` call has no effect when called normally.
 * Workaround is to wrap it in a setTimeout call to force
 * react to dispatch the event.
 */
export const WithNewDetermination = ({
  shouldCreate = false,
  children: determinationFields,
}: PropsWithChildren<WithNewDetermintionProps>) => {
  const { data, dataDriller, updateData } = useGenericContext<
    IncomeDetermination
  >(FormContext);

  // Verify whether the family has a determination with ID 0
  const newDet = dataDriller
    .at('family')
    .at('incomeDeterminations')
    .find((det) => det.id === 0);

  // If the family lacks a determination with id 0, make a new
  // one for them with id 0 based on a shallow copy of their most
  // recent existing income determination.
  useEffect(() => {
    if (shouldCreate && newDet.value == undefined) {
      var detToAdd = JSON.parse(JSON.stringify(data));
      detToAdd.id = 0;
      setTimeout(() => updateData(detToAdd), 0);
    }
  }, [shouldCreate]); // Specifically NOT dependent on `data`: loops

  return <>{determinationFields}</>;
};
