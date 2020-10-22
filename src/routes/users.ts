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

/**
 * /users/isSSofMS GET
 *
 * Returns whether the current user associated with the
 * authenticated request is a single site user of a
 * multi-site provider.
 */
usersRouter.get('/isSSofMS', async (req, res) => {
  const user = req.user;
  await controller.addDataToUser(user);
  const organizations = user.organizations || [];
  const sites = user.sites || [];
  if (sites.length === 1 || organizations.length === 1) {
    res.send(organizations[0].sites.length > 1 ? true : false);
  } else {
    res.send(false);
  }
});
