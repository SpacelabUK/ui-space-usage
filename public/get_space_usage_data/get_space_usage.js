
const { axios } = window;

const getSpaceUsageQueryString = `query SpaceUsagesbySiteId($siteId: String) { 
  SpaceUsagesBySiteId(siteId: $siteId) {
    _id
    spaceId
    usagePeriodStartTime
    usagePeriodEndTime
    numberOfPeopleRecorded
  }}`;

const makeSaveSpaceUsageCall = async siteId => axios.post(
  'http://localhost:4000/',
  {
    query: getSpaceUsageQueryString,
    variables: { siteId },
  },
);

const checkIfSuccessfulGraphqlResponseHasNestedError = (response) => {
  if (response.data.errors && response.data.errors.length > 0) {
    const nestedError = new Error(response.data.errors[0].message);
    nestedError.errorDetail = response;
    throw nestedError;
  }
};

export const getSpaceUsage = siteId => new Promise(async (resolve, reject) => {
  try {
    const response = await makeSaveSpaceUsageCall(siteId);
    checkIfSuccessfulGraphqlResponseHasNestedError(response);

    resolve(response.data.data.SpaceUsagesBySiteId);
  } catch (error) {
    reject(error);
  }
});

export default getSpaceUsage;
