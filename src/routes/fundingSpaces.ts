import express from 'express';
import { passAsyncError } from '../middleware/error/passAsyncError';
import * as controller from '../controllers/fundingSpaces';
import { parseQueryString } from '../utils/parseQueryString';

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

    const fundingMap = parseQueryString(req, 'fundingMap');
    if (fundingMap === 'true') {
      const fundingSpacesMap = await controller.getFundingSpaceMap();
      res.send({ fundingSpacesMap });
    }

    const fundingSpaces = await controller.getFundingSpaces(
      req.user,
      organizationIds
    );
    res.send(fundingSpaces);
  })
);
