import express from 'express';
import { passAsyncError } from '../middleware/error/passAsyncError';
import { BadRequestError, ApiError } from '../middleware/error/errors';
import { getManager } from 'typeorm';
import { AddSiteRequest } from '../entity/AddSiteRequest';
import { UpdateSiteRequest } from '../entity/UpdateSiteRequest';
import { ChangeFundingSpaceRequest } from '../entity/ChangeFundingSpaceRequest';

export const revisionsRouter = express.Router();

/**
 * POST /revision-request/:organizationId
 *
 * Saves a change request object accumulated from a user filling out
 * a form into the DB as its three separate kinds of requests (one table
 * for each).
 */
revisionsRouter.post(
  '/:organizationId',
  passAsyncError(async (req, res) => {
    try {
      const organizationId = parseInt(req.params['organizationId']);
      const {
        updateSiteRequests,
        addSiteRequests,
        fundingSpaceRequests,
      } = req.body;
      await getManager().transaction(async (tManager) => {
        await updateSiteRequests.forEach(async (r: UpdateSiteRequest) => {
          const dbReq = await tManager.create(UpdateSiteRequest, {
            ...r,
            organizationId,
          });
          await getManager().save(dbReq);
        });
        await addSiteRequests.forEach(async (r: AddSiteRequest) => {
          const dbReq = await tManager.create(AddSiteRequest, {
            ...r,
            organizationId,
          });
          await getManager().save(dbReq);
        });
        await fundingSpaceRequests.forEach(
          async (r: ChangeFundingSpaceRequest) => {
            const dbReq = await tManager.create(ChangeFundingSpaceRequest, {
              ...r,
              organizationId,
            });
            await getManager().save(dbReq);
          }
        );
      });

      res.status(201).send(201);
    } catch (err) {
      if (err instanceof ApiError) throw err;
      console.error("Couldn't submit revision request: ", err);
      throw new BadRequestError('Revision request information not saved');
    }
  })
);

/**
 * GET /revision-request/update-sites/:organizationId
 *
 * Retrieves all update site requests associated with an organization.
 * Currently, there's no way to call this within the app. This is
 * here so that the integration test can successfully determine whether
 * revision information was properly saved.
 */
revisionsRouter.get(
  '/update-sites/:organizationId',
  passAsyncError(async (req, res) => {
    try {
      const organizationId = parseInt(req.params['organizationId']);
      const revisions = await getManager().find(UpdateSiteRequest, {
        where: { organizationId },
      });
      res.send(revisions);
    } catch (err) {
      if (err instanceof ApiError) throw err;
      console.error(
        "Couldn't retrieve revision requests associated with your org: ",
        err
      );
      throw new BadRequestError('Revision requests not retrieved');
    }
  })
);

/**
 * GET /revision-request/add-sites/:organizationId
 */
revisionsRouter.get(
  '/add-sites/:organizationId',
  passAsyncError(async (req, res) => {
    try {
      const organizationId = parseInt(req.params['organizationId']);
      const revisions = await getManager().find(AddSiteRequest, {
        where: { organizationId },
      });
      res.send(revisions);
    } catch (err) {
      if (err instanceof ApiError) throw err;
      console.error(
        "Couldn't retrieve revision requests associated with your org: ",
        err
      );
      throw new BadRequestError('Revision requests not retrieved');
    }
  })
);

/**
 * GET /revision-request/change-funding-spaces/:organizationId
 */
revisionsRouter.get(
  '/change-funding-spaces/:organizationId',
  passAsyncError(async (req, res) => {
    try {
      const organizationId = parseInt(req.params['organizationId']);
      const revisions = await getManager().find(ChangeFundingSpaceRequest, {
        where: { organizationId },
      });
      res.send(revisions);
    } catch (err) {
      if (err instanceof ApiError) throw err;
      console.error(
        "Couldn't retrieve revision requests associated with your org: ",
        err
      );
      throw new BadRequestError('Revision requests not retrieved');
    }
  })
);
