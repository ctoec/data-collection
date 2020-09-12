import express from 'express';
import { Response, Request } from 'express';
import * as controller from '../controllers/export';
import * as childController from '../controllers/children';
import { passAsyncError } from '../middleware/error/passAsyncError';

export const exportRouter = express.Router();

/**
 * /csv-upload/idString GET
 * Asks the backend to put together a CSV file containing rows of
 * Child record objects with data formatted in the same way as
 * the upload template.
 */
exportRouter.get(
  '/csv-upload/:idString',
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