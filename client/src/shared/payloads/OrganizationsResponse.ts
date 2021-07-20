export interface OrganizationSummary {
  id: number;
  providerName: string;
  communityId?: number;
  uniqueIdType: string;
  siteCount: number;
  fundingSource: string;
}
