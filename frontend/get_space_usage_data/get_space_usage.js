
const { axios } = window;

const getSpaceUsageQueryString = `query SpaceUsagesWithSpaceInfo(
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

const makeGetSpaceUsageCall = async queryParams => axios.post(
  'https://test-api-space-usage.herokuapp.com/',
  {
    query: getSpaceUsageQueryString,
    variables: queryParams,
  },
);

const throwIfSuccessfulGraphqlResponseHasNestedError = (response) => {
  if (response.data.errors && response.data.errors.length > 0) {
    const nestedError = new Error(response.data.errors[0].message);
    nestedError.errorDetail = response;
    throw nestedError;
  }
};

export const getSpaceUsage = async (siteId) => {
  try {
    const response = await makeGetSpaceUsageCall(siteId);
    throwIfSuccessfulGraphqlResponseHasNestedError(response);

    return response.data.data.SpaceUsagesWithSpaceInfo;
  } catch (error) {
    throw error;
  }
};

export default getSpaceUsage;
