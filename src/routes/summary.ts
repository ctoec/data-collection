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

    const;
    const summaryResponse: SummaryResponse = {
      totalProviderUsers: await controller.getProviderUserCount(),
      totalOrganizations: await controller.getOrganizationCount(),
      totalChildren: await controller.getChildCount(),
      siteSummaries: {
        s,
      },
    };
  })
);
