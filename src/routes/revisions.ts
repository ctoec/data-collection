import express from 'express';
import * as fundingSpacesController from '../controllers/fundingSpaces';
import { passAsyncError } from '../middleware/error/passAsyncError';
import { BadRequestError, ApiError } from '../middleware/error/errors';
import { getManager } from 'typeorm';
import { AddSiteRequest } from '../entity/AddSiteRequest';
import { UpdateSiteRequest } from '../entity/UpdateSiteRequest';
import { ChangeFundingSpaceRequest } from '../entity/ChangeFundingSpaceRequest';
import { getFundingSpaceDisplayName } from '../../client/src/containers/Home/utils/getFundingSpaceDisplayName';

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
      const organizationIds = !organizationId
        ? undefined
        : ((Array.isArray(organizationId)
            ? organizationId
            : [organizationId]) as string[]);
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

        // Spaces the user starts with so we can find the diff
        const initialFundingSpaces = await fundingSpacesController.getFundingSpaces(
          req.user,
          organizationIds
        );
        await fundingSpaceRequests.forEach(
          async (r: ChangeFundingSpaceRequest) => {
            const match = initialFundingSpaces.find((fs) => {
              const stringRep = getFundingSpaceDisplayName(fs);
              return stringRep === r.fundingSpace;
            });

            // Create if it's either a new FS or the user is saying they
            // shouldn't have this space
            if (!match || (match && !r.shouldHave)) {
              const dbReq = await tManager.create(ChangeFundingSpaceRequest, {
                ...r,
                organizationId,
                authorId,
                createdAt,
              });
              await getManager().save(dbReq);
            }
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
