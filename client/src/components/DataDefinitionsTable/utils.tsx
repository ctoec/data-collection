import React from 'react';
import cx from 'classnames';
import { Tag } from '@ctoec/component-library';
import { TEMPLATE_REQUIREMENT_LEVELS } from '../../shared/constants';

export const getRequiredTag = (requirementLevel: string) => (
  <Tag
    text={requirementLevel}
    className={cx(
      'required-tag',
      {
        'required-tag--required':
          requirementLevel === TEMPLATE_REQUIREMENT_LEVELS.REQUIRED,
      },
      {
        'required-tag--conditional':
          requirementLevel === TEMPLATE_REQUIREMENT_LEVELS.CONDITIONAL,
      }
    )}
  />
);
