import express from 'express';
import { getManager } from 'typeorm';
import * as controller from '../controllers/users';
import { User } from '../entity';
import { ApiError, BadRequestError, ForbiddenError, InternalServerError } from '../middleware/error/errors';
import { passAsyncError } from '../middleware/error/passAsyncError';

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
  await controller.addSiteAndOrgDataToUser(user);
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

usersRouter.get(
  '/by-email/:email',
  passAsyncError(async (req, res) => {
    try {
      const email = req.params['email'];
      const users = await controller.getUsersByEmail(email);
      res.send(users);
    } catch (err) {
      if (err instanceof ApiError) throw err;
      console.error('Error finding user by email address: ', err);
      throw new InternalServerError('Unable to find users for create organization.');
    }
  })
);

usersRouter.get(
  '/:id',
  passAsyncError(async ({ user, params }, res) => {
    if (!user.isAdmin) throw new ForbiddenError();
    if (!params.id) throw new BadRequestError('No user ID provided.');
    const foundUser = await controller.getUserById(params.id);
    res.send(foundUser);
  })
);

usersRouter.put(
  '/:id',
  passAsyncError(async ({ user, params, body }, res) => {
    if (!user.isAdmin) throw new ForbiddenError();
    if (!params.id || !body)
      throw new BadRequestError('No user information provided.');
    await controller.updateUserName(params.id, body);
    res.sendStatus(200);
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
