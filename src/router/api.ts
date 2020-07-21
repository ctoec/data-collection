import express from 'express';
import multer from 'multer';
import path from 'path';
import { handleError } from '../middleware/error';
// import { authenticate } from "../middleware/authenticate";

// TODO: Combine file upload with TSOA

// Create file uploader middleware
const upload = multer({ dest: path.join('/tmp/uploads') });

// Create router for API responses
const router = express.Router();
// Require authentication for all API requests
// router.use(authenticate);

// Post file uploads, storing file on disk, and return local file name
router.post('/reports', upload.single('file'), (req, res) => {
	res.status(200).send({
		filename: req.file.filename,
		message: 'Successfully uploaded file'
	});
});

router.use(handleError);

export default router;