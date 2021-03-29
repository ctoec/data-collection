import express, { Router } from 'express';
import * as usersController from '../controllers/users';

export const usersRouter: Router = express.Router();

usersRouter.get('/users/current', usersController.getCurrentUser);

usersRouter.post('/users/current', usersController.updateCurrentUser);
