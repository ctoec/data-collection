import 'jest-canvas-mock';
import '@testing-library/jest-dom/extend-expect';
import { enableFetchMocks } from 'jest-fetch-mock';
import { toHaveNoViolations } from 'jest-axe';
import * as moment from 'moment';

// adds the 'fetchMock' global variable and rewires 'fetch' global
// to call 'fetchMock' instead of the real implementation
// (Needed due to how react-dates DayPicker component works,
// I think how it tried to access custom styles?)
enableFetchMocks();

// Extend jest expect to assert no axe violations
expect.extend(toHaveNoViolations);

// Mock date to return a consistent value for snapshot testing
Date.now = () => moment.utc('2008-06-22').milliseconds();
