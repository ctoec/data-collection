import { RACE_FIELDS } from '../../client/src/shared/models';
import { Child } from '../entity';

export function isChildRaceIndicated(child: Child) {
  if (child.raceNotDisclosed) return true;
  return !RACE_FIELDS.every((field) => !child[field]);
}
