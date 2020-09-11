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
  passAsyncError(async (req: Request, res: Response) => {
    try {
      const idString = req.params['idString'];
      const uploadedIds = idString.split(',');

      // var childrenToMap: Child[] = [];
      // for (let i = 0; i < uploadedIds.length; i++) {
      // childrenToMap.push(
      // await getManager().findOne(Child, { id: uploadedIds[i] })
      // );
      // }

      // BETTER AND SAFER WAY TO GET THE CHILDREN WITH ALL THEIR
      // RELATED OBJECTS
      const childrenToMap = await Promise.all(
        uploadedIds.map((id) => childController.getChildById(id))
      );

      // SENDING THE ID STRING WORKS
      // res.send(idString);

      // COLLECTING THE CHILDREN IN THIS FUNCTION WORKS
      // FORGET THE CONTROLLER, JUST DO IT HERE
      // res.send(childrenToMap);
      // OKAY, THIS WORKS AT SENDING ALL INFORMATION FROM
      // THE CHILD OBJECT
      res.send(controller.streamUploadedChildren(res, childrenToMap));

      // SENDING THE UPLOAD CHILDREN DOESN'T WORK,
      // EVEN IF I JUST TRY TO SEND BACK CHILDRENTOMAP
      // res.send(controller.streamUploadedChildren(res, uploadedIds));
    } catch (err) {
      console.error('Unable to download exported enrollment data: ', err);
    }
  })
  // });
);
