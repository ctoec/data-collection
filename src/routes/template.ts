import express from 'express';

import { streamTabularData } from '../utils/streamTabularData';
import { getAllColumnMetadata } from '../template';

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
