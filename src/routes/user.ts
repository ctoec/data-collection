import express from 'express';

export const router = express.Router();

router.get('/current', (req, res) => {
  res.send(req.user);
});
