import { SummaryResponse } from '../../client/src/shared/payloads/SummaryResponse';
import express from 'express';
import { UnauthorizedError } from 'express-jwt';
import { ForbiddenError } from '../middleware/error/errors';
import { passAsyncError } from '../middleware/error/passAsyncError';
import * as controller from '../controllers/summary';

export const summaryRouter = express.Router();

summaryRouter.get(
  '/',
  passAsyncError(async (req, res) => {
    const user = req.user;
    if (!user.isAdmin) {
      throw new ForbiddenError();
    }

    const sites = await controller.getSiteSummaries();
    const summaryResponse: SummaryResponse = {
      totalProviderUsers: await controller.getProviderUserCount(),
      totalOrganizations: await controller.getOrganizationCount(),
      totalChildren: await controller.getChildCount(),
      siteSummaries: sites.reduce(
        (_siteSummaries, site) => {
          if (!!site.submissionDate) {
            _siteSummaries.completedSites.push(site);
          } else if (site.totalEnrollments > 0) {
            _siteSummaries.inProgressSites.push(site);
          } else {
            _siteSummaries.noDataSites.push(site);
          }
          return _siteSummaries;
        },
        { completedSites: [], inProgressSites: [], noDataSites: [] }
      ),
    };

    res.send(summaryResponse);
  })
);
