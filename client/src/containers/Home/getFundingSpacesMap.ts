type enrollmentTime = {
  timeType: string;
  filled: number;
  capacity: number;
};
type enrolledAgeGroup = {
  ageGroup: string;
  includedTimes: enrollmentTime[];
};

export const getFundingSpacesDisplay = (fundingSpacesMap: any) => {
  // Structure to hold accumulated display information about each funding space
  const fundingSpacesDisplay: {
    sourceName: string;
    includedAgeGroups: enrolledAgeGroup[];
  }[] = [];

  // Server will return funding spaces separated by unique IDs, which
  // the post-submit home page will hand us, so go through them to
  // place each space in the right bucket
  fundingSpacesMap.forEach((fsCount: any) => {
    // Start with overall funding source, since it's the header
    const source = fsCount.fundingSpace.source;
    let matchingSource = fundingSpacesDisplay.find(
      (fsd) => fsd.sourceName === source
    );
    if (matchingSource === undefined) {
      matchingSource = { sourceName: source, includedAgeGroups: [] };
      fundingSpacesDisplay.push(matchingSource);
    }

    // Then the age group, since a source is made up of a list of these
    const ageGroup = fsCount.fundingSpace.ageGroup;
    let matchingGroup = matchingSource.includedAgeGroups.find(
      (ag) => ag.ageGroup === ageGroup
    );
    if (matchingGroup === undefined) {
      matchingGroup = { ageGroup, includedTimes: [] };
      matchingSource.includedAgeGroups.push(matchingGroup);
    }

    // Then go to the times within each age group, because that's the
    // last sub-list
    const timeType = fsCount.fundingSpace.time;
    let matchingTime = matchingGroup.includedTimes.find(
      (t) => t.timeType === timeType
    );
    if (matchingTime === undefined) {
      matchingTime = {
        timeType,
        filled: 0,
        capacity: fsCount.fundingSpace.capacity,
      };
      matchingGroup.includedTimes.push(matchingTime);
    }
    matchingTime.filled += 1;
  });

  return fundingSpacesDisplay;
};
