import { Moment } from 'moment';

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
  siteName: string;
  organizationId: number;
  providerName: string;
  totalEnrollments: number;
  submissionDate?: Moment;
}
