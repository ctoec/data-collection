import {
  Controller,
	Get,
	Post,
	Request,
  Route,
	Security,
} from "tsoa";
import { ReportService } from "../../services/report/ReportService";
import multer from "multer";
import path from "path";
import { readFileSync } from "fs";

@Route("reports")
export class ReportController extends Controller {

	@Security("jwt")
	@Get("{reportId}")
	public async get(
		reportId: string
	): Promise<any> {
		// TODO Connect to ReportService
		return readFileSync(path.join('/tmp/uploads', reportId), 'utf-8').replace("\"","");
	}

	@Security("jwt")
	@Post('')
	public async post(
		@Request() req: Express.Request
	): Promise<any> {
		await this.handleFile(req);
		const reportService = new ReportService();
		const enrollmentReport = reportService.parse(req.file);
		reportService.save(enrollmentReport);
		return {
			filename: req.file.filename
		};
	}

	private async handleFile(req: Express.Request): Promise<any> {
		const uploadedFileHandler = multer({ dest: path.join('/tmp/uploads') }).single("file");
		return new Promise((resolve, reject) => {
			uploadedFileHandler(req as any, undefined, async (error) => {
				if (error) {
					reject(error);
				}
				resolve();
			});
		});
	}
}
