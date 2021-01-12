export interface Revision {
  id: number;
  userId?: number;
  orgId?: number;
  siteNameChanges?: string[];
  newSiteName?: string;
  newSiteLicense?: string;
  newSiteLicenseExempt?: boolean;
  newSiteNaeycId?: string;
  newSiteIsHeadstart?: boolean;
  newSiteNoNaeyc?: boolean;
  newSiteRegistryId?: string;
  fundingSpaceTypes?: string[];
}
