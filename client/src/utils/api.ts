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
 * Internal function to perform a fetch request against the backend,
 * and handle any error responses, defined as responses with status >= 400
 * @param path
 * @param body
 * @param method
 * @param opts
 */
function api(path: string, body: any, method: 'GET' | 'POST', opts: ApiOpts) {
  const headers = opts.headers || {};
  if (opts.accessToken) {
    headers['Authorization'] = `Bearer ${opts.accessToken}`;
  }

  return fetch(`${getCurrentHost()}/api/${path}`, {
    method,
    headers,
    body,
  }).then((res) => {
    if (res.status >= 400) {
      res
        .json()
        .catch((err) => {
          console.log(err);
          throw new Error('Unknown API error occurred');
        })
        .then((errorResponse) => {
          throw new Error(errorResponse.error);
        });
    }

    if (opts.jsonParse === false) return res;
    return res.json();
  });
}
