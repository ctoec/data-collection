import { apiGet } from './api';
import { ContentDisposition, parse } from 'content-disposition';
import { saveAs } from 'file-saver';

export async function downloadStreamToFile(route: string, defaultFileName?: string) {
  const res: Response = await apiGet(route, { jsonParse: false });

  const fileBlob = new Blob([(await res.arrayBuffer())], {
    type: 'application/octet-stream'
  });

  saveAs(fileBlob, parseFileName(res, defaultFileName));
}

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