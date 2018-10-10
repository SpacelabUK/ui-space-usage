
const { axios } = window;

const getSpaceUsageQueryString = `query SpaceUsagesbySiteId($siteId: String) {
  SpaceUsagesBySiteId(siteId: $siteId) {
    spaceId
    usagePeriodStartTime
    usagePeriodEndTime
    spaceName
    occupancy
  }}`;

const makeSaveSpaceUsageCall = async siteId => axios.post(
  'https://test-api-space-usage.herokuapp.com/',
  {
    query: getSpaceUsageQueryString,
    variables: { siteId },
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
    const response = await makeSaveSpaceUsageCall(siteId);
    throwIfSuccessfulGraphqlResponseHasNestedError(response);

    return response.data.data.SpaceUsagesBySiteId;
  } catch (error) {
    throw error;
  }
};

export default getSpaceUsage;
