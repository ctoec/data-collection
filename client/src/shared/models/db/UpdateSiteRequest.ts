export interface UpdateSiteRequest {
  id: number;
  organizationId: number;
  siteId: number;
  newName?: string;
  remove?: boolean;
}
