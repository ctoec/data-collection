import express from 'express';
import { passAsyncError } from '../middleware/error/passAsyncError';
import * as controller from '../controllers/fundingSpaces';

export const fundingSpacesRouter = express.Router();

fundingSpacesRouter.get(
  '/',
  passAsyncError(async (req, res) => {
    const organizationId = req.query['organizationId'];
    const organizationIds = !organizationId
      ? undefined
      : ((Array.isArray(organizationId)
          ? organizationId
          : [organizationId]) as string[]);
    const fundingSpaces = await controller.getFundingSpaces(
      req.user,
      organizationIds
    );
    res.send(fundingSpaces);
  })
);
