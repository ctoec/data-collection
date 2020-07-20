import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { handleError } from '../middleware/error';

// TODO: Combine file upload with TSOA

// Create file uploader middleware
const upload = multer({ dest: path.join('/tmp/uploads') });

// Create router for API responses
const router = express.Router();

// Post file uploads, storing file on disk, and return local file name
router.post('/reports', upload.single('file'), (req, res) => {
  res.status(200).send({
    filename: req.file.filename,
    message: 'Successfully uploaded file',
  });
});

router.get('/reports/:id', (req, res) => {
	const id = req.params.id || '';
	if(!id) {
		res.sendStatus(404);
	}

	fs.readFile(path.join('/tmp/uploads', id), 'utf-8', (err, data) => {
		if(err) {
			res.sendStatus(500);
		}

		res.status(200).send(
			data
		);
	})
})

router.use(handleError);

export default router;
