import express from 'express';
import { Response, Request } from 'express';
import { BookType } from 'xlsx/types';

import { streamTabularData } from '../utils/streamTabularData';
import { getAllColumnMetadata } from '../template';
import { InternalServerError } from '../middleware/error/errors';
import { passAsyncError } from '../middleware/error/passAsyncError';
import {
  completeChildren,
  childrenAllMissingOneField,
  childrenMissingSomeInfo,
} from '../data/children';
import { streamUploadedChildren } from '../controllers/export';
import { parseQueryString } from '../utils/parseQueryString';

export const templateRouter = express.Router();
/**
 * /template/column-metadata GET
 *
 * Returns all column metadata from the FlattenedEnrollment model,
 * as an array of ColumnMetadata objects
 */
templateRouter.get('/column-metadata', (_, res) => {
  res.send(getAllColumnMetadata());
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
      }
      res.send(
        await streamUploadedChildren(res, fakeChildren, fileType as BookType)
      );
    } catch (err) {
      console.error('Unable to download example', err);
      throw new InternalServerError('Could not download example file: ' + err);
    }
  })
);
