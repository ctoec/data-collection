import express from 'express';
import * as incomeController from '../controllers/incomeDeterminations';
import * as familyController from '../controllers/families';

export const familyRouter = express.Router();

familyRouter.put('/families/:familyId', familyController.updateFamily);

familyRouter.put(
  '/families/:familyId/income-determinations/:determinationId',
  incomeController.updateIncomeDetermination
);

familyRouter.post(
  '/families/:familyId/income-determinations',
  incomeController.createIncomeDetermination
);

familyRouter.delete(
  '/families/:familyId/income-determinations/:determinationId',
  incomeController.deleteIncomeDetermination
);
