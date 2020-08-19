import express from 'express';
import { getAllEnrollmentColumns } from './template';

export const router = express.Router();

/**
 * /data-definitions GET
 *
 * Returns all data-definition metadata from the FlattenedEnrollment model,
 * as an array of DataDefinitionInfo objects
 */
router.get('/', (_, res) => {
  res.send(getAllEnrollmentColumns());
});
