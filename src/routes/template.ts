import express from 'express';
import { Response, Request } from 'express';
import { BookType } from 'xlsx/types';

import { streamTabularData } from '../utils/generateFiles/streamTabularData';
import { getAllColumnMetadata } from '../template';
import { TEMPLATE_VERSION, TEMPLATE_LAST_UPDATED } from '../template/constants';
import { InternalServerError } from '../middleware/error/errors';
import { passAsyncError } from '../middleware/error/passAsyncError';
import {
  completeChildren,
  childrenAllMissingOneField,
  childrenMissingSomeInfo,
  childrenMissingOptionalFields,
  childrenMissingConditionalFields,
} from '../data/fake/children';
import { streamUploadedChildren } from '../controllers/export';
import { parseQueryString } from '../utils/parseQueryString';
import { TemplateMetadata } from '../../client/src/shared/payloads';

export const templateRouter = express.Router();
/**
 * /template/metadata GET
 *
 * Returns a TemplateMetadata object, including:
 * 	- template version
 * 	- template update date
 * 	- column metadata from the FlattenedEnrollment model
 */
templateRouter.get('/metadata', (_, res) => {
  const templateMetadata: TemplateMetadata = {
    version: TEMPLATE_VERSION,
    lastUpdated: TEMPLATE_LAST_UPDATED,
    columnMetadata: getAllColumnMetadata(),
  };
  res.send(templateMetadata);
});

/**
 * /template/csv GET
 *
 * Returns all column metadata from the FlattenedEnrollment model,
 * in the form of an csv file stream.
 */
templateRouter.get('/csv', (_, res) => {
  streamTabularData(res, 'csv');
});

/**
 * /template/xlsx GET
 *
 * Returns all column metadata from the FlattenedEnrollment model,
 * in the form of an xlsx file stream.
 */
templateRouter.get('/xlsx', (_, res) => {
  streamTabularData(res, 'xlsx');
});

/**
 * /template/example/:fileType GET
 */
templateRouter.get(
  '/example/:fileType',
  passAsyncError(async (req: Request, res: Response) => {
    try {
      const fileType = req.params['fileType'] || 'csv';
      const whichFakeChildren = parseQueryString(req, 'whichFakeChildren');
      let fakeChildren = completeChildren;
      if (whichFakeChildren === 'missingSome') {
        fakeChildren = childrenMissingSomeInfo;
      } else if (whichFakeChildren === 'missingOne') {
        fakeChildren = childrenAllMissingOneField;
      } else if (whichFakeChildren === 'missingOptional') {
        fakeChildren = childrenMissingOptionalFields;
      } else if (whichFakeChildren === 'missingConditional') {
        fakeChildren = childrenMissingConditionalFields;
      }
      await streamUploadedChildren(res, fakeChildren, fileType as BookType);
    } catch (err) {
      console.error('Unable to download example', err);
      throw new InternalServerError('Could not download example file: ' + err);
    }
  })
);
