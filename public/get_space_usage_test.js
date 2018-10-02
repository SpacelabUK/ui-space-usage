
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const stampit = require('stampit');
const getSpaceUsage = require('./get_space_usage');

chai.use(require('chai-string'));

chai.use(chaiAsPromised);
const { expect } = chai;


describe('space_usage_api', () => {
  let expectedSpaceUsageQueryString;
  let postStub;
  let mockSiteId;

  before(() => {
    expectedSpaceUsageQueryString = `query SpaceUsagesBySiteId($siteId: SpaceUsageInput) {
      CreateSpaceUsage(siteId: $siteId) {
      _id
      spaceId
      usagePeriodStartTime
      usagePeriodEndTime
      numberOfPeopleRecorded
      }
    }`;

    mockSiteId = '1901';
  });

  it('should make call to get space usage api with the specified site id and correct query format', async () => {
    const returnedSpaceUsages = await getSpaceUsage(mockSiteId);

    expect(postStub.args[0][0]).equals('/');
    expect(postStub.args[0][1].variables).deep.equals({ siteId: mockSiteId });
    expect(postStub.args[0][1].query).equalIgnoreSpaces(expectedSpaceUsageQueryString);
  });
});

