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
  Family,
  FamilyFromJSON,
  FamilyFromJSONTyped,
  FamilyToJSON,
  UpdateMetaData,
  UpdateMetaDataFromJSON,
  UpdateMetaDataFromJSONTyped,
  UpdateMetaDataToJSON,
} from './';

/**
 *
 * @export
 * @interface IncomeDetermination
 */
export interface IncomeDetermination {
  /**
   *
   * @type {number}
   * @memberof IncomeDetermination
   */
  id: number;
  /**
   *
   * @type {number}
   * @memberof IncomeDetermination
   */
  numberOfPeople?: number;
  /**
   *
   * @type {number}
   * @memberof IncomeDetermination
   */
  income?: number;
  /**
   *
   * @type {Date}
   * @memberof IncomeDetermination
   */
  determinationDate?: Date;
  /**
   *
   * @type {Family}
   * @memberof IncomeDetermination
   */
  family: Family;
  /**
   *
   * @type {UpdateMetaData}
   * @memberof IncomeDetermination
   */
  updateMetaData?: UpdateMetaData;
}

export function IncomeDeterminationFromJSON(json: any): IncomeDetermination {
  return IncomeDeterminationFromJSONTyped(json, false);
}

export function IncomeDeterminationFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): IncomeDetermination {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    id: json['id'],
    numberOfPeople: !exists(json, 'numberOfPeople')
      ? undefined
      : json['numberOfPeople'],
    income: !exists(json, 'income') ? undefined : json['income'],
    determinationDate: !exists(json, 'determinationDate')
      ? undefined
      : new Date(json['determinationDate']),
    family: FamilyFromJSON(json['family']),
    updateMetaData: !exists(json, 'updateMetaData')
      ? undefined
      : UpdateMetaDataFromJSON(json['updateMetaData']),
  };
}

export function IncomeDeterminationToJSON(
  value?: IncomeDetermination | null
): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    id: value.id,
    numberOfPeople: value.numberOfPeople,
    income: value.income,
    determinationDate:
      value.determinationDate === undefined
        ? undefined
        : value.determinationDate.toISOString(),
    family: FamilyToJSON(value.family),
    updateMetaData: UpdateMetaDataToJSON(value.updateMetaData),
  };
}
