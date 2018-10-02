
import { getSpaceUsage } from '../../public/get_space_usage.js';

/* eslint-env browser */
const { expect } = window.chai;
const { axios } = window;
const { sinon } = window;


describe('space_usage_api', () => {
  let expectedSpaceUsageQueryString;
  let mockSpaceUsageData;
  let postStub;
  let mockSiteId;

  const setUpStubbedSuccessfulGetSpaceUsageApiCall = () => {
    mockSpaceUsageData = 'space usage data';

    const mockSuccessfulGetSpaceUsageResponse = {
      data: {
        data: {
          SpaceUsagesBySiteId: mockSpaceUsageData,
        },
      },
    };

    postStub = sinon.stub(axios, 'post');
    postStub.returns(mockSuccessfulGetSpaceUsageResponse);
  };

  const getErrorFromFailingPromise = async (failingPromise) => {
    try {
      return await failingPromise;
    } catch (error) {
      return error;
    }
  };

  const setStubbedSpaceUsageApiToReturnSuccessResponseWithNestedError = () => {
    const apiResponseErrorMessage = 'some error';
    const apiResponse = {
      data: {
        errors: [{
          message: apiResponseErrorMessage,
        }],
      },
    };
    postStub.returns(Promise.resolve(apiResponse));

    return { apiResponseErrorMessage, apiResponse };
  };

  before(() => {
    expectedSpaceUsageQueryString = `query SpaceUsagesbySiteId($siteId: String) { 
      SpaceUsagesBySiteId(siteId: $siteId) {
        _id
        spaceId
        usagePeriodStartTime
        usagePeriodEndTime
        numberOfPeopleRecorded
      }}`;

    setUpStubbedSuccessfulGetSpaceUsageApiCall();

    mockSiteId = '1901';
  });

  it('should call get space usage api with the specified site id and correct query format, returning the space usage data via a promise', async () => {
    const returnedSpaceUsages = await getSpaceUsage(mockSiteId);

    expect(postStub.args[0][0]).equals('http://localhost:4000/');
    expect(postStub.args[0][1].variables).deep.equals({ siteId: mockSiteId });
    expect(postStub.args[0][1].query).equalIgnoreSpaces(expectedSpaceUsageQueryString);
    expect(returnedSpaceUsages).equals(mockSpaceUsageData);
  });

  it('should return a failing promise with error if get space usage response is an HTTP error thrown by server', async () => {
    const error = new Error('some error');
    postStub.returns(Promise.reject(error));

    const response = getSpaceUsage(mockSiteId);
    const errorFromSaveSpaceUsage = await getErrorFromFailingPromise(response);

    expect(errorFromSaveSpaceUsage).equals(error);
  });

  it('should return a failing promise with error when get space usage response is 200 success BUT has errors buried in response (this is sometimes graphql format)', async () => {
    const { apiResponseErrorMessage, apiResponse }
      = setStubbedSpaceUsageApiToReturnSuccessResponseWithNestedError();

    const response = getSpaceUsage(mockSiteId);
    const errorFromSaveSpaceUsage = await getErrorFromFailingPromise(response);

    expect(errorFromSaveSpaceUsage.message).equals(apiResponseErrorMessage);
    expect(errorFromSaveSpaceUsage.errorDetail).equals(apiResponse);
  });
});

