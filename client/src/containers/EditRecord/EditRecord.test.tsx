import React from 'react';
import EditRecord from './EditRecord';
import { accessibilityTestHelper, snapshotTestHelper } from '../../testHelpers';
import { Child, Organization, BirthCertificateType } from '../../shared/models';

const child = {
  id: '00000000-0000-0000-0000-000000000000',
  firstName: 'First',
  lastName: 'Last',
  birthCertificateType: BirthCertificateType.unavailable,
  organization: { id: 1 } as Organization,
  enrollments: [],
  family: {
    id: 1,
    incomeDeterminations: [],
  },
} as Child;

jest.mock('../../utils/api');
import * as api from '../../utils/api';
import { waitFor } from '@testing-library/dom';
const apiMock = api as jest.Mocked<typeof api>;
const waitGetChild = () => waitFor(() => expect(apiMock.apiGet).toBeCalled());

describe('EditRecord', () => {
  beforeEach(() => {
    apiMock.apiGet.mockReturnValue(new Promise((resolve) => resolve(child)));
  });
  snapshotTestHelper(<EditRecord />, {
    wrapInRouter: true,
    before: waitGetChild,
  });
  accessibilityTestHelper(<EditRecord />, {
    wrapInRouter: true,
    before: waitGetChild,
  });
  afterEach(() => jest.clearAllMocks());
});
