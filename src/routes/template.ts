import express from 'express';

import * as controller from '../controllers/template';
import { getAllColumnMetadata } from '../template';

export const templateRouter = express.Router();
/**
 * /template/column-metadata GET
 *
 * Returns all column metadata from the FlattenedEnrollment model,
 * as an array of ColumnMetadata objects
 */
templateRouter.get('/column-metadata', (req, res) => {
  res.send(getAllColumnMetadata());
});

/**
 * /template/csv GET
 *
 * Returns all column metadata from the FlattenedEnrollment model,
 * in the form of an csv file stream.
 */
templateRouter.get('/csv', (req, res) => {
  controller.streamTemplate(res, 'csv');
});

/**
 * /template/xlsx GET
 *
 * Returns all column metadata from the FlattenedEnrollment model,
 * in the form of an xlsx file stream.
 */
templateRouter.get('/xlsx', (req, res) => {
  controller.streamTemplate(res, 'xlsx');
});
