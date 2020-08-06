import express from 'express';
import { getManager } from 'typeorm';
import { User } from '../entity';

export const router = express.Router();

router.get('/current', (req, res) => {
  const currentUser = getManager().findOne(User, req.user.id);
  res.send(currentUser);
});
