import express from 'express';
import { passAsyncError } from '../middleware/error/passAsyncError';
import { BadRequestError, ApiError } from '../middleware/error/errors';
import { getManager } from 'typeorm';
import { Revision } from '../entity/Revision';

export const revisionsRouter = express.Router();

revisionsRouter.post(
  '/:organizationId',
  passAsyncError(async (req, res) => {
    try {
      const orgId = parseInt(req.params['organizationId']);
      const userId = req.user.id;
      const revisionRequest = req.body;
      const dbRequest = await getManager().create(Revision, {
        ...revisionRequest,
        orgId,
        userId,
      });
      await getManager().save(dbRequest);
      res.status(201).send({ id: dbRequest.id });
    } catch (err) {
      if (err instanceof ApiError) throw err;
      console.error("Couldn't submit revision request: ", err);
      throw new BadRequestError('Revision request information not saved');
    }
  })
);

revisionsRouter.get(
  '/:organizationId',
  passAsyncError(async (req, res) => {
    try {
      const orgId = parseInt(req.params['organizationId']);
      const revisions = await getManager().find(Revision, { where: { orgId } });
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
