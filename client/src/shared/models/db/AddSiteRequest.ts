export interface AddSiteRequest {
  id: number;
  organizationId: number;
  siteName: string;
  licenseId?: string;
  naeycId?: string;
  registryId?: string;
}
