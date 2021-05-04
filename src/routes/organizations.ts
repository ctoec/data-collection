import express from 'express';
import { passAsyncError } from '../middleware/error/passAsyncError';
import * as controller from '../controllers/organizations';
import { parseQueryString } from '../utils/parseQueryString';
import { getFundingSpaceMap } from '../controllers/children';

export const organizationsRouter = express.Router();

organizationsRouter.get(
  '/',
  passAsyncError(async (req, res) => {
    const organizationIds = parseQueryString(req, 'organizationId', {
      forceArray: true,
    }) as string[];

    const organizations = await controller.getOrganizations(
      req.user,
      organizationIds
    );

    res.send(organizations);
  })
);

// fundingSpacesRouter.get(
//   '/funding-map',
//   passAsyncError(async (req, res) => {
//     const organizationIds = parseQueryString(req, 'organizationId', {
//       forceArray: true,
//     }) as string[];

//     const fundingSpacesMap = await getFundingSpaceMap(
//       req.user,
//       organizationIds
//     );

//     res.send({ fundingSpacesMap });
//   })
// );
