import express from 'express';
import { getManager } from 'typeorm';
import { EnrollmentReport } from '../entity';
import multer from 'multer';
import { parseUploadedTemplate } from '../utils/parseUploadedTemplate';

export const router = express.Router();

router.get('/:reportId', (req, res) => {
  const id = parseInt(req.params['id']) || 0;
  const report = getManager().findOne(EnrollmentReport, id);
  res.send(report);
});

const upload = multer({ dest: '/tmp/uploads' }).single('file');
router.post('/', upload, (req, res) => {
  const flattenedEnrollments = parseUploadedTemplate(req.file);
  const report = getManager().save(
    getManager().create(EnrollmentReport, { enrollments: flattenedEnrollments })
  );
  res.send(report);
});
