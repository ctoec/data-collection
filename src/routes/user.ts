import express from 'express';

export const router = express.Router();

/**
 * /users/current GET
 *
 * Returns the user associated with the
 * authenticated request
 */
router.get('/current', (req, res) => {
  res.send(req.user);
});
