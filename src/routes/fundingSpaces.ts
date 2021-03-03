import express from 'express';
import { passAsyncError } from '../middleware/error/passAsyncError';
import * as controller from '../controllers/fundingSpaces';
import { parseQueryString } from '../utils/parseQueryString';
import { getByOrganizationId, getChildren } from '../controllers/children';

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

    const fundingMap = parseQueryString(req, 'fundingMap');
    if (fundingMap === 'true') {
      const children = await getByOrganizationId(req.user, organizationIds);
      const fundingSpacesMap = await controller.getFundingSpaceMap(
        fundingSpaces,
        children
      );
      res.send({ fundingSpacesMap });
      return;
    }

    res.send(fundingSpaces);
  })
);
