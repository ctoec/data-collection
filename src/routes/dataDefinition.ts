import express from 'express';
import { getConnection } from 'typeorm';
import { FlattenedEnrollment } from '../../entity';
import { getDataDefinition } from '../decorators/dataDefinition';

export const router = express.Router();

router.get('/', (req, res) => {
	const dataDefinitions = getConnection()
		.getMetadata(FlattenedEnrollment)
		.columns
		.map((column) => getDataDefinition(new FlattenedEnrollment(), column.propertyName))
		.filter((dataDefinition) => !!dataDefinition);

	res.send(dataDefinitions);
});
