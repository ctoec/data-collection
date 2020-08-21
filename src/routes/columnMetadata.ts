import express from 'express';
import { Response, Request } from 'express';
import * as controller from '../controllers/columnMetadata';


export const columnMetadataRouter = express.Router();

/**
 * /column-metadata GET
 *
 * Returns all column metadata from the FlattenedEnrollment model,
 * as an array of ColumnMetadata objects
 */
columnMetadataRouter.get('/', (req: Request, res: Response) => {
  res.send(controller.getAllEnrollmentColumns());
});

/**
 * /column-metadata/csv GET
 *
 * Returns all column metadata from the FlattenedEnrollment model,
 * in the form of an csv file stream.
 */
columnMetadataRouter.get('/csv', (req: Request, res: Response) => {
  controller.streamTemplate(res, 'csv');
});

/**
 * /column-metadata/xlsx GET
 *
 * Returns all column metadata from the FlattenedEnrollment model,
 * in the form of an xlsx file stream.
 */
columnMetadataRouter.get('/xlsx', (req: Request, res: Response) => {
  controller.streamTemplate(res, 'xlsx');
});