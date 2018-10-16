
export default `query SpaceUsagesWithSpaceInfo(
  $siteId: String,
  $dayStartTime: String,
  $dayEndTime: String
  ) { 
    SpaceUsagesWithSpaceInfo(
      siteId: $siteId,
      dayStartTime: $dayStartTime,
      dayEndTime: $dayEndTime
    ) {
      spaceId
      usagePeriodStartTime
      usagePeriodEndTime
      spaceName
      spaceCategory
      occupancy
      numberOfPeopleRecorded
  }}`;
