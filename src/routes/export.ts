import express from 'express';
import { Response, Request } from 'express';
import * as controller from '../controllers/export';
import { passAsyncError } from '../middleware/error/passAsyncError';

export const exportRouter = express.Router();

exportRouter.get(
  '/csv-upload/:idString',
  // (req: Request, res: Response) => {
  // res.send(controller.streamTemplate(res));
  passAsyncError(async (req: Request, res: Response) => {
    try {
      const idString = req.params['idString'];
      const uploadedIds = idString.split(',');
      // const children = await controller.retrieveChildren(uploadedIds);
      res.send(controller.streamUploadedChildren(res, uploadedIds));
    } catch (err) {
      console.error('BADNESS');
    }
  })
  // });
);
