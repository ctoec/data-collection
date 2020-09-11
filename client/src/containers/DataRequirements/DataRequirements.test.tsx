import React from 'react';
import DataRequirements from './DataRequirements';
import { accessibilityTestHelper, snapshotTestHelper } from '../../testHelpers';

jest.mock('../../utils/api');
import * as api from '../../utils/api';
import { ColumnMetadata } from '../../shared/models';
import { waitFor } from '@testing-library/react';
const apiMock = api as jest.Mocked<typeof api>;

const dataRequirements: ColumnMetadata[] = [
  {
    section: 'Section one',
    example: 'Blue',
    format: 'string',
    reason: 'So we know your favorite color',
    definition: 'The color you like the most',
    required: 'Optional',
    formattedName: 'Favorite color',
    propertyName: 'favoriteColor',
  },
  {
    section: 'Section two',
    example: '130',
    format: 'number',
    reason: 'So we know your lucky number',
    definition: 'The number you find brings the most luck',
    required: 'Required',
    formattedName: 'Lucky number',
    propertyName: 'luckyNumber',
  },
];
describe('DataRequirements', () => {
  beforeAll(() =>
    apiMock.apiGet.mockReturnValue(
      new Promise((resolve) => resolve(dataRequirements))
    )
  );

  const helperOpts = {
    wrapInRouter: true,
    before: () => waitFor(() => expect(apiMock.apiGet).toBeCalled()),
  };
  snapshotTestHelper(<DataRequirements />, helperOpts);
  accessibilityTestHelper(<DataRequirements />, helperOpts);

  afterAll(() => jest.clearAllMocks());
});
