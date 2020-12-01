import { UndefinableBoolean } from "../../client/src/shared/models";
import { random } from "faker";

export function weightedBoolean(probabilityTruePercentage: number) {
  // Param should be a number between 1 and 100
  return Math.random() * 100 <= probabilityTruePercentage;
}

export function weightedUndefinableBoolean(probabilityTruePercentage: number, probabilityNotCollectedPercentage?: number) {
  if (probabilityNotCollectedPercentage && weightedBoolean(probabilityNotCollectedPercentage)) {
    return UndefinableBoolean.NotCollected
  }
  return weightedBoolean(probabilityTruePercentage) ? UndefinableBoolean.Yes : UndefinableBoolean.No
}
