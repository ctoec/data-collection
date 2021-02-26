export interface SummaryResponse {
  totalChildren: number;
  totalProviderUsers: number;
  totalOrganizations: number;
  siteSummaries: {
    completedSites: SiteSummary[];
    inProgressSites: SiteSummary[];
    noDataSites: SiteSummary[];
  };
}

export interface SiteSummary {
  id: number;
  name: string;
  organizationId: number;
  organizationName: string;
  totalEnrollments: number;
}
