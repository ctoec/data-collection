import express from 'express';
import { getManager } from 'typeorm';
import { User } from '../entity';
import { passAsyncError } from '../middleware/error/passAsyncError';
import * as controller from '../controllers/users';
import { BadRequestError } from '../middleware/error/errors';
import { ForbiddenError } from '../middleware/error/errors';

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

usersRouter.get(
  '/',
  passAsyncError(async (req, res) => {
    const user = req.user;
    if (!user.isAdmin) {
      throw new ForbiddenError();
    }
    const users = await controller.getUsers();

    res.send(users);
  })
);

usersRouter.post(
  '/current',
  passAsyncError(async (req, res) => {
    try {
      const user = req.user;
      const updatedUser = getManager().merge(User, user, req.body);
      await getManager().save(updatedUser);
      res.sendStatus(200);
    } catch (err) {
      console.error(err);
      throw new BadRequestError('User information not saved.');
    }
  })
);
