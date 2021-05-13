import { Region } from "./Region";

/**
 * Basic type to hold the state information for creating a new site
 * as part of creating a new organization.
 */
 export type NewSite = {
  name: string;
  titleI: boolean;
  region: Region;
  facilityCode?: string;
  licenseNumber?: string;
  registryId?: string;
  naeycId?: string;
}