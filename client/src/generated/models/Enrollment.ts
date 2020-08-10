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
  AgeGroup,
  AgeGroupFromJSON,
  AgeGroupFromJSONTyped,
  AgeGroupToJSON,
  Child,
  ChildFromJSON,
  ChildFromJSONTyped,
  ChildToJSON,
  Funding,
  FundingFromJSON,
  FundingFromJSONTyped,
  FundingToJSON,
  Site,
  SiteFromJSON,
  SiteFromJSONTyped,
  SiteToJSON,
  UpdateMetaData,
  UpdateMetaDataFromJSON,
  UpdateMetaDataFromJSONTyped,
  UpdateMetaDataToJSON,
} from './';

/**
 *
 * @export
 * @interface Enrollment
 */
export interface Enrollment {
  /**
   *
   * @type {number}
   * @memberof Enrollment
   */
  id: number;
  /**
   *
   * @type {Child}
   * @memberof Enrollment
   */
  child: Child;
  /**
   *
   * @type {Site}
   * @memberof Enrollment
   */
  site: Site;
  /**
   *
   * @type {AgeGroup}
   * @memberof Enrollment
   */
  ageGroup?: AgeGroup;
  /**
   *
   * @type {Date}
   * @memberof Enrollment
   */
  entry?: Date;
  /**
   *
   * @type {Date}
   * @memberof Enrollment
   */
  exit?: Date;
  /**
   *
   * @type {string}
   * @memberof Enrollment
   */
  exitReason?: string;
  /**
   *
   * @type {Array<Funding>}
   * @memberof Enrollment
   */
  fundings?: Array<Funding>;
  /**
   *
   * @type {UpdateMetaData}
   * @memberof Enrollment
   */
  updateMetaData?: UpdateMetaData;
}

export function EnrollmentFromJSON(json: any): Enrollment {
  return EnrollmentFromJSONTyped(json, false);
}

export function EnrollmentFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): Enrollment {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    id: json['id'],
    child: ChildFromJSON(json['child']),
    site: SiteFromJSON(json['site']),
    ageGroup: !exists(json, 'ageGroup')
      ? undefined
      : AgeGroupFromJSON(json['ageGroup']),
    entry: !exists(json, 'entry') ? undefined : new Date(json['entry']),
    exit: !exists(json, 'exit') ? undefined : new Date(json['exit']),
    exitReason: !exists(json, 'exitReason') ? undefined : json['exitReason'],
    fundings: !exists(json, 'fundings')
      ? undefined
      : (json['fundings'] as Array<any>).map(FundingFromJSON),
    updateMetaData: !exists(json, 'updateMetaData')
      ? undefined
      : UpdateMetaDataFromJSON(json['updateMetaData']),
  };
}

export function EnrollmentToJSON(value?: Enrollment | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    id: value.id,
    child: ChildToJSON(value.child),
    site: SiteToJSON(value.site),
    ageGroup: AgeGroupToJSON(value.ageGroup),
    entry: value.entry === undefined ? undefined : value.entry.toISOString(),
    exit: value.exit === undefined ? undefined : value.exit.toISOString(),
    exitReason: value.exitReason,
    fundings:
      value.fundings === undefined
        ? undefined
        : (value.fundings as Array<any>).map(FundingToJSON),
    updateMetaData: UpdateMetaDataToJSON(value.updateMetaData),
  };
}
