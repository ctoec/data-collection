import express from 'express';
import { getConnection } from 'typeorm';
import { FlattenedEnrollment } from '../entity';
import { getDataDefinition } from '../decorators/dataDefinition';

export const router = express.Router();

/**
 * /data-definitions GET
 *
 * Returns all data-definition metadata from the FlattenedEnrollment model,
 * as an array of DataDefinitionInfo objects
 */
router.get('/', (_, res) => {
  const dataDefinitions = getConnection()
    .getMetadata(FlattenedEnrollment)
    .columns.map((column) =>
      getDataDefinition(new FlattenedEnrollment(), column.propertyName)
    )
    .filter((dataDefinition) => !!dataDefinition);

  res.send(dataDefinitions);
});
