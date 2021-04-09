import express from 'express';
import { passAsyncError } from '../middleware/error/passAsyncError';
import * as controller from '../controllers/fundingSpaces';
import { parseQueryString } from '../utils/parseQueryString';
import { getFundingSpaceMap } from '../controllers/children';

export const fundingSpacesRouter = express.Router();

fundingSpacesRouter.get(
  '/',
  passAsyncError(async (req, res) => {
    const organizationIds = parseQueryString(req, 'organizationId', {
      forceArray: true,
    }) as string[];

    const fundingSpaces = await controller.getFundingSpaces(
      req.user,
      organizationIds
    );

    res.send(fundingSpaces);
  })
);

fundingSpacesRouter.get(
  '/funding-map',
  passAsyncError(async (req, res) => {
    const organizationIds = parseQueryString(req, 'organizationId', {
      forceArray: true,
    }) as string[];

    const fundingSpacesMap = await getFundingSpaceMap(
      req.user,
      organizationIds
    );

    res.send({ fundingSpacesMap });
  })
);
