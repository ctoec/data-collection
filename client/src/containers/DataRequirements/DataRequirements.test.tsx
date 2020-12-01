import React from 'react';
import DataRequirements from './DataRequirements';
import { accessibilityTestHelper, snapshotTestHelper } from '../../testHelpers';

jest.mock('../../utils/api');
import * as api from '../../utils/api';
import { ColumnMetadata } from '../../shared/models';
import { waitFor } from '@testing-library/react';
import { TemplateMetadata } from '../../shared/payloads';
import moment from 'moment';
const apiMock = api as jest.Mocked<typeof api>;

const dataRequirements: ColumnMetadata[] = [
  {
    section: 'Section one',
    example: 'Blue',
    format: 'string',
    reason: 'So we know your favorite color',
    definition: 'The color you like the most',
    requirementLevel: 'Optional',
    formattedName: 'Favorite color',
    propertyName: 'favoriteColor',
  },
  {
    section: 'Section two',
    example: '130',
    format: 'number',
    reason: 'So we know your lucky number',
    definition: 'The number you find brings the most luck',
    requirementLevel: 'Required',
    formattedName: 'Lucky number',
    propertyName: 'luckyNumber',
  },
];

const templateMetadata: TemplateMetadata = {
  version: 1,
  lastUpdated: moment(),
  columnMetadata: dataRequirements,
};
describe('DataRequirements', () => {
  beforeAll(() =>
    apiMock.apiGet.mockReturnValue(
      new Promise((resolve) => resolve(templateMetadata))
    )
  );

  const helperOpts = {
    wrapInRouter: true,
    wrapInSWRConfig: true,
  };
  snapshotTestHelper(<DataRequirements />, {
    ...helperOpts,
    // Mystery about useSWR in tests. See `Roster.test.tsx` for more in-depth info
    before: () => waitFor(() => expect(apiMock.apiGet).toBeCalled()),
  });
  accessibilityTestHelper(<DataRequirements />, helperOpts);

  afterAll(() => {
    jest.clearAllMocks();
  });
});
