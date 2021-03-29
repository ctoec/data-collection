import express, { Router } from 'express';
import * as controller from '../controllers/oecReport';

export const oecReportRouter: Router = express.Router();

oecReportRouter.get(
  '/oec-report/are-all-orgs-submitted',
  controller.checkIfAllOrgsSubmitted
);

oecReportRouter.get(`/oec-report/:organizationId`, controller.getOecReport);

oecReportRouter.put('/oec-report/:organizationId', controller.createOecReport);
