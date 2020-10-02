import express from 'express';
import { passAsyncError } from '../middleware/error/passAsyncError';
import * as controller from '../controllers/fundingSpaces';

export const fundingSpacesRouter = express.Router();

fundingSpacesRouter.get(
  '/',
  passAsyncError(async (req, res) => {
    let organizationId: number;

    if (!!req.query?.organizationId) {
      organizationId = Number(req.query?.organizationId);
    }

    const fundingSpaces = await controller.getFundingSpaces(
      req.user,
      organizationId
    );
    res.send(fundingSpaces);
  })
);
