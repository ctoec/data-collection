export interface AddSiteRequest {
  id: number;
  organizationId: number;
  authorId: number;
  createdAt: Date;
  siteName: string;
  licenseId?: string;
  naeycId?: string;
  registryId?: string;
}
