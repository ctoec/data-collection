import express from 'express';
import * as controller from '../controllers/users';

export const usersRouter = express.Router();

/**
 * /users/current GET
 *
 * Returns the user associated with the
 * authenticated request, augmented with all
 * read/write sites and orgs
 */
usersRouter.get('/current', async (req, res) => {
  const user = req.user;
  await controller.addDataToUser(user);
  res.send(user);
});
