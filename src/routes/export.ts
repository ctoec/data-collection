import express from 'express';
import { Response, Request } from 'express';
import * as controller from '../controllers/export';

export const exportRouter = express.Router();

exportRouter.get('/csv-upload', (req: Request, res: Response) => {
  res.send(controller.streamTemplate(res));
});
