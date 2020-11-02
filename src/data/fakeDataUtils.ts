export function weightedBoolean(probabilityTruePercentage: number) {
  // Param should be a number between 1 and 100
  return Math.random() * 100 <= probabilityTruePercentage;
}
