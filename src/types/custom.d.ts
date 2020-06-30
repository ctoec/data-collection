declare namespace Express {
	export interface Request {
		token: any;
		sub: string;
		userId: number;
	}
}