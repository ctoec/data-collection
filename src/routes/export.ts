import express from 'express';
import { Response, Request } from 'express';
import { getManager } from 'typeorm';
import * as controller from '../controllers/export';
import { passAsyncError } from '../middleware/error/passAsyncError';
import { Child } from '../entity';

export const exportRouter = express.Router();

exportRouter.get(
  '/csv-upload/:idString',
  passAsyncError(async (req: Request, res: Response) => {
    try {
      const idString = req.params['idString'];
      const uploadedIds = idString.split(',');
      res.send(idString);
      // res.send(controller.streamUploadedChildren(res, uploadedIds));
    } catch (err) {
      console.error('BADNESS');
    }
  })
  // });
);
