export interface UpdateSiteRequest {
  id: number;
  organizationId: number;
  authorId: number;
  createdAt: Date;
  siteId: number;
  newName?: string;
  remove?: boolean;
}
