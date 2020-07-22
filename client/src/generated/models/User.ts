/* tslint:disable */
/* eslint-disable */
/**
 * data-collection
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.0.1
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import {
  OrganizationPermission,
  OrganizationPermissionFromJSON,
  OrganizationPermissionFromJSONTyped,
  OrganizationPermissionToJSON,
  Site,
  SiteFromJSON,
  SiteFromJSONTyped,
  SiteToJSON,
  SitePermission,
  SitePermissionFromJSON,
  SitePermissionFromJSONTyped,
  SitePermissionToJSON,
} from './';

/**
 *
 * @export
 * @interface User
 */
export interface User {
  /**
   *
   * @type {number}
   * @memberof User
   */
  id: number;
  /**
   *
   * @type {string}
   * @memberof User
   */
  wingedKeysId: string;
  /**
   *
   * @type {string}
   * @memberof User
   */
  firstName: string;
  /**
   *
   * @type {string}
   * @memberof User
   */
  lastName: string;
  /**
   *
   * @type {string}
   * @memberof User
   */
  middleName?: string;
  /**
   *
   * @type {string}
   * @memberof User
   */
  suffix?: string;
  /**
   *
   * @type {Array<OrganizationPermission>}
   * @memberof User
   */
  orgPermissions?: Array<OrganizationPermission>;
  /**
   *
   * @type {Array<SitePermission>}
   * @memberof User
   */
  sitePermissions?: Array<SitePermission>;
  /**
   *
   * @type {Array<Site>}
   * @memberof User
   */
  sites?: Array<Site>;
}

export function UserFromJSON(json: any): User {
  return UserFromJSONTyped(json, false);
}

export function UserFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): User {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    id: json['id'],
    wingedKeysId: json['wingedKeysId'],
    firstName: json['firstName'],
    lastName: json['lastName'],
    middleName: !exists(json, 'middleName') ? undefined : json['middleName'],
    suffix: !exists(json, 'suffix') ? undefined : json['suffix'],
    orgPermissions: !exists(json, 'orgPermissions')
      ? undefined
      : (json['orgPermissions'] as Array<any>).map(
          OrganizationPermissionFromJSON
        ),
    sitePermissions: !exists(json, 'sitePermissions')
      ? undefined
      : (json['sitePermissions'] as Array<any>).map(SitePermissionFromJSON),
    sites: !exists(json, 'sites')
      ? undefined
      : (json['sites'] as Array<any>).map(SiteFromJSON),
  };
}

export function UserToJSON(value?: User | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    id: value.id,
    wingedKeysId: value.wingedKeysId,
    firstName: value.firstName,
    lastName: value.lastName,
    middleName: value.middleName,
    suffix: value.suffix,
    orgPermissions:
      value.orgPermissions === undefined
        ? undefined
        : (value.orgPermissions as Array<any>).map(
            OrganizationPermissionToJSON
          ),
    sitePermissions:
      value.sitePermissions === undefined
        ? undefined
        : (value.sitePermissions as Array<any>).map(SitePermissionToJSON),
    sites:
      value.sites === undefined
        ? undefined
        : (value.sites as Array<any>).map(SiteToJSON),
  };
}
