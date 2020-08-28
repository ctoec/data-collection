import express from 'express';
import { passAsyncError } from '../middleware/error/passAsyncError';
import * as controller from '../controllers/fundingSpaces';

export const fundingSpacesRouter = express.Router();

fundingSpacesRouter.get(
  '/',
  passAsyncError(async (req, res) => {
    const fundingSpaces = await controller.getFundingSpaces(req.user);

    res.send(fundingSpaces);
  })
);
