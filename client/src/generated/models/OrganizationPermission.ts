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
  Organization,
  OrganizationFromJSON,
  OrganizationFromJSONTyped,
  OrganizationToJSON,
  User,
  UserFromJSON,
  UserFromJSONTyped,
  UserToJSON,
} from './';

/**
 *
 * @export
 * @interface OrganizationPermission
 */
export interface OrganizationPermission {
  /**
   *
   * @type {number}
   * @memberof OrganizationPermission
   */
  id: number;
  /**
   *
   * @type {User}
   * @memberof OrganizationPermission
   */
  user: User;
  /**
   *
   * @type {Organization}
   * @memberof OrganizationPermission
   */
  organization: Organization;
}

export function OrganizationPermissionFromJSON(
  json: any
): OrganizationPermission {
  return OrganizationPermissionFromJSONTyped(json, false);
}

export function OrganizationPermissionFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): OrganizationPermission {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    id: json['id'],
    user: UserFromJSON(json['user']),
    organization: OrganizationFromJSON(json['organization']),
  };
}

export function OrganizationPermissionToJSON(
  value?: OrganizationPermission | null
): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    id: value.id,
    user: UserToJSON(value.user),
    organization: OrganizationToJSON(value.organization),
  };
}
