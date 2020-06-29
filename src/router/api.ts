import express from 'express';
import multer from 'multer';
import path from 'path';
import { handleError } from '../middleware/error';
import { authenticate } from "../middleware/authenticate";
import { getUserByWingedKeysId } from '../data/users';

// Create file uploader middleware
const upload = multer({ dest: path.join('/tmp/uploads') });

// Create router for API responses
const router = express.Router();
// Require authentication for all API requests
router.use(authenticate);

// Get the current user information
router.get('/users/current', (req, res) => {
	const wingedKeysId = req.sub;
	res.json(getUserByWingedKeysId(wingedKeysId));
});

// Post file uploads, storing file on disk, and return local file name
router.post('/reports', upload.single('file'), (req, res) => {
	res.status(200).send(req.file.filename);
});

router.use(handleError);

export default router;