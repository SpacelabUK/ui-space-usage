
import { getSpaceUsage } from '../../frontend/get_space_usage_data/get_space_usage.js';
import getErrorFromFailingPromise from '../helpers/error_from_failing_promise_getter.js';
import expectedSpaceUsageQueryString from './expected_space_usage_query_string.js';

/* eslint-env browser */
const { sinon } = window;
const { axios } = window;
const { expect } = window.chai;


describe('space_usage_api', () => {
  let mockSpaceUsageData;
  const postStub = sinon.stub(axios, 'post');
  let getSpaceUsageParams;

  const setUpStubbedSuccessfulGetSpaceUsageApiCall = () => {
    mockSpaceUsageData = 'space usage data';

    const mockSuccessfulGetSpaceUsageResponse = {
      data: {
        data: {
          SpaceUsagesWithSpaceInfo: mockSpaceUsageData,
        },
      },
    };

    postStub.returns(Promise.resolve(mockSuccessfulGetSpaceUsageResponse));
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
    setUpStubbedSuccessfulGetSpaceUsageApiCall();

    getSpaceUsageParams = {
      siteId: '1901',
      dayStartTime: '08:00:00 GMT',
      dayEndTime: '19:00:00 GMT',
    };
  });

  it('should call get space usage api with the specified site id and correct query format, returning the space usage data via a promise', async () => {
    const returnedSpaceUsages = await getSpaceUsage(getSpaceUsageParams);

    expect(postStub.args[0][0]).equals('https://test-api-space-usage.herokuapp.com/');
    expect(postStub.args[0][1].variables).deep.equals(getSpaceUsageParams);
    expect(postStub.args[0][1].query).equalIgnoreSpaces(expectedSpaceUsageQueryString);
    expect(returnedSpaceUsages).equals(mockSpaceUsageData);
  });

  it('should return a failing promise with error if get space usage response is an HTTP error thrown by server', async () => {
    const error = new Error('some error');
    postStub.returns(Promise.reject(error));

    const response = getSpaceUsage(getSpaceUsageParams);
    const errorFromSaveSpaceUsage = await getErrorFromFailingPromise(response);

    expect(errorFromSaveSpaceUsage).equals(error);
  });

  it('should return a failing promise with error when get space usage response is 200 success BUT has errors buried in response (this is sometimes graphql format)', async () => {
    const { apiResponseErrorMessage, apiResponse }
      = setStubbedSpaceUsageApiToReturnSuccessResponseWithNestedError();

    const response = getSpaceUsage(getSpaceUsageParams);
    const errorFromSaveSpaceUsage = await getErrorFromFailingPromise(response);

    expect(errorFromSaveSpaceUsage.message).equals(apiResponseErrorMessage);
    expect(errorFromSaveSpaceUsage.errorDetail).equals(apiResponse);
  });
});

