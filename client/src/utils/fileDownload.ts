import { apiGet } from './api';
import { ContentDisposition, parse } from 'content-disposition';
import { saveAs } from 'file-saver';

/**
 * Download a file stream from the route specified and save it to browser,
 * either with the file name specified or as "download".
 */
export async function downloadStreamToFile(
  route: string,
  defaultFileName?: string,
  authContext?: string
) {
  let res: Response;
  if (!!authContext && authContext != '') {
    res = await apiGet(route, {
      jsonParse: false,
      accessToken: authContext,
    });
  } else {
    res = await apiGet(route, { jsonParse: false });
  }

  const fileBlob = new Blob([await res.arrayBuffer()], {
    type: 'application/octet-stream',
  });

  saveAs(fileBlob, parseFileName(res, defaultFileName));
}

/**
 * Function that handles parsing of a file name to attach to an
 * information stream to save as a file.
 * @param res
 * @param defaultFileName
 */
function parseFileName(res: Response, defaultFileName?: string): string {
  const cdHeader = res.headers.get('Content-Disposition');

  if (cdHeader) {
    const cd: ContentDisposition = parse(cdHeader);

    if (cd && cd.parameters && cd.parameters.fileName) {
      return cd.parameters.fileName;
    }
  }

  return defaultFileName || 'download';
}
