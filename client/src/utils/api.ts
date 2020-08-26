import moment from 'moment';
import { getCurrentHost } from './getCurrentHost';

type ApiOpts = {
  accessToken?: string | null;
  jsonParse?: boolean;
  headers?: { [key: string]: string };
};

/**
 * Helper function to perform a fetch GET request against the backend
 * @param path
 * @param opts
 */
export function apiGet(path: string, opts?: ApiOpts) {
  return api(path, undefined, 'GET', opts || {});
}

/**
 * Helper function to perform a fetch POST request against the backend
 * @param path
 * @param body
 * @param opts
 */
export function apiPost(path: string, body: any, opts?: ApiOpts) {
  return api(path, body, 'POST', opts || {});
}

/**
 * Helper function to perform a fetch PUT request against the backend
 * @param path
 * @param body
 * @param opts
 */
export function apiPut(path: string, body: any, opts?: ApiOpts) {
  return api(path, body, 'PUT', opts || {});
}

/**
 * Internal function to perform a fetch request against the backend,
 * and handle any error responses, defined as responses with status >= 400
 * @param path
 * @param body
 * @param method
 * @param opts
 */
async function api(
  path: string,
  body: any,
  method: 'GET' | 'POST' | 'PUT',
  opts: ApiOpts
) {
  const headers = opts.headers || {};
  if (opts.accessToken) {
    headers['Authorization'] = `Bearer ${opts.accessToken}`;
  }

  const res = await fetch(`${getCurrentHost()}/api/${path}`, {
    method,
    headers,
    body,
  });
  // Handle API error response
  if (res.status >= 400) {
    try {
      const errorResponse = await res.json();
      // return rejected promise instead of throwing error to avoid catch
      return Promise.reject(errorResponse.error);
    } catch (err) {
      console.error('error parsing API error response', err);
      throw new Error('There was an error');
    }
  }
  // Handle API success response
  else {
    if (opts.jsonParse === false) {
      return res;
    }

    const jsonString = await res.text();
    return JSON.parse(jsonString, dateReviver);
  }
}

const dateReviver = (_: any, value: string) => {
  if (typeof value === 'string') {
    const parsedDate = moment.utc(value, undefined, true);
    if (parsedDate.isValid()) return parsedDate;
  }
  return value;
};
