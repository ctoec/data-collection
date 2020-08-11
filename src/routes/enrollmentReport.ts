import express from 'express';
import { getManager } from 'typeorm';
import { EnrollmentReport } from '../entity';
import multer from 'multer';
import { parseUploadedTemplate } from '../utils/parseUploadedTemplate';

export const router = express.Router();

router.get('/:reportId', async (req, res) => {
  const id = parseInt(req.params['reportId']) || 0;
  const report = await getManager().findOne(EnrollmentReport, id);
  console.log('REPORT', report);
  res.send(report);
});

const upload = multer({ dest: '/tmp/uploads' }).single('file');
router.post('/', upload, (req, res) => {
  const flattenedEnrollments = parseUploadedTemplate(req.file);
  console.log('enrollemnts', flattenedEnrollments);
  getManager()
    .save(
      getManager().create(EnrollmentReport, {
        enrollments: flattenedEnrollments,
      })
    )
    .then((report) => {
      console.log('FOOBAR', report);
      res.send(report);
    });
});
