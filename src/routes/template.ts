import express from 'express';

import * as controller from '../controllers/template';

export const templateRouter = express.Router();
/**
 * /enrollment-reports/template/column-metadata GET
 *
 * Returns all column metadata from the FlattenedEnrollment model,
 * as an array of ColumnMetadata objects
 */
templateRouter.get('/column-metadata', (req, res) => {
  res.send(controller.getAllEnrollmentColumns());
});

/**
 * /enrollment-reports/template/csv GET
 *
 * Returns all column metadata from the FlattenedEnrollment model,
 * in the form of an csv file stream.
 */
templateRouter.get('/csv', (req, res) => {
  controller.streamTemplate(res, 'csv');
});

/**
 * /enrollment-reports/template/xlsx GET
 *
 * Returns all column metadata from the FlattenedEnrollment model,
 * in the form of an xlsx file stream.
 */
templateRouter.get('/xlsx', (req, res) => {
  controller.streamTemplate(res, 'xlsx');
});
