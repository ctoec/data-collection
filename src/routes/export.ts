import express from 'express';
import { Response, Request } from 'express';
import { getManager } from 'typeorm';
import * as controller from '../controllers/export';
import * as childController from '../controllers/children';
import { passAsyncError } from '../middleware/error/passAsyncError';
import { Child } from '../entity';

export const exportRouter = express.Router();

exportRouter.get(
  '/csv-upload/:idString',
  // (req: Request, res: Response) => {
  // res.send(controller.streamTemplate(res));
  passAsyncError(async (req: Request, res: Response) => {
    try {
      const idString = req.params['idString'];
      const uploadedIds = idString.split(',');
      const childrenToMap = await Promise.all(
        uploadedIds.map((id) => childController.getChildById(id))
      );
      res.send(controller.streamUploadedChildren(res, childrenToMap));
    } catch (err) {
      console.error('Unable to download exported enrollment data: ', err);
    }
  })
  // });
);
