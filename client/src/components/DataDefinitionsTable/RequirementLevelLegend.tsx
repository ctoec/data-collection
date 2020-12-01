import React from 'react';
import { TEMPLATE_REQUIREMENT_LEVELS } from '../../shared/constants';
import { getRequiredTag } from './utils';

export const RequirementLevelLegend: React.FC = () => (
  <table>
    <caption className="text-bold text-left margin-bottom-1">
      Requirement levels
    </caption>
    <tbody>
      <tr>
        <td>{getRequiredTag(TEMPLATE_REQUIREMENT_LEVELS.REQUIRED)}</td>
        <td>Must be entered for all enrollments</td>
      </tr>
      <tr>
        <td>{getRequiredTag(TEMPLATE_REQUIREMENT_LEVELS.CONDITIONAL)}</td>
        <td>
          Must be entered for certain scenarios (such as for an exited
          enrollment)
        </td>
      </tr>
      <tr>
        <td>{getRequiredTag(TEMPLATE_REQUIREMENT_LEVELS.OPTIONAL)}</td>
        <td>
          Suggested for better data quality and record matching, but not
          required for submission to OEC
        </td>
      </tr>
    </tbody>
  </table>
);
