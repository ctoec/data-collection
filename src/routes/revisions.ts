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
      const authorId = req.user.id;
      const createdAt = new Date();
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
            authorId,
            createdAt,
          });
          await getManager().save(dbReq);
        });
        await addSiteRequests.forEach(async (r: AddSiteRequest) => {
          const dbReq = await tManager.create(AddSiteRequest, {
            ...r,
            organizationId,
            authorId,
            createdAt,
          });
          await getManager().save(dbReq);
        });
        await fundingSpaceRequests.forEach(
          async (r: ChangeFundingSpaceRequest) => {
            const dbReq = await tManager.create(ChangeFundingSpaceRequest, {
              ...r,
              organizationId,
              authorId,
              createdAt,
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
