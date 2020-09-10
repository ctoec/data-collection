import express from 'express';
import { Response, Request } from 'express';
import { getManager } from 'typeorm';
import * as controller from '../controllers/export';
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
      var childrenToMap: Child[] = [];
      for (let i = 0; i < uploadedIds.length; i++) {
        childrenToMap.push(
          await getManager().findOne(Child, { id: uploadedIds[i] })
        );
      }
      // uploadedIds.forEach(async (id) => {
      // childrenToMap.push(await getManager().findOne(Child, { id: id }));
      // });
      // childrenToMap.push(await getManager().findOne(Child, {id: uploadedIds[0]}));
      // res.send(childrenToMap);
      res.send(controller.streamUploadedChildren(res, childrenToMap));
    } catch (err) {
      console.error('BADNESS');
    }
  })
  // });
);
