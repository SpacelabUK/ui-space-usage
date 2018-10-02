
import { getSpaceUsage } from './get_space_usage.js';

const { expect } = chai;


describe('space_usage_api', () => {
  let expectedSpaceUsageQueryString;
  let postStub;
  let mockSiteId;

  before(() => {
    expectedSpaceUsageQueryString = `query SpaceUsagesbySiteId($siteId: String) { 
      SpaceUsagesBySiteId(siteId: $siteId) {
        _id
        spaceId
        usagePeriodStartTime
        usagePeriodEndTime
        numberOfPeopleRecorded
      }}`;

    const mockSpaceUsageData = 'space usage data';
    const mockSuccessfulGetSpaceUsageResponse = {
      data: {
        data: {
          SpaceUsagesBySiteId: mockSpaceUsageData,
        },
      },
    };
    postStub = sinon.stub(axios, 'post');
    postStub.returns(mockSuccessfulGetSpaceUsageResponse);

    mockSiteId = '1901';
  });

  it('should make call to get space usage api with the specified site id and correct query format', async () => {
    const returnedSpaceUsages = await getSpaceUsage(mockSiteId);

    expect(postStub.args[0][0]).equals('http://localhost:4000/');
    expect(postStub.args[0][1].variables).deep.equals({ siteId: mockSiteId });
    expect(postStub.args[0][1].query).equalIgnoreSpaces(expectedSpaceUsageQueryString);
  });
});

