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
    Age,
    AgeFromJSON,
    AgeFromJSONTyped,
    AgeToJSON,
    Funding,
    FundingFromJSON,
    FundingFromJSONTyped,
    FundingToJSON,
    FundingSource,
    FundingSourceFromJSON,
    FundingSourceFromJSONTyped,
    FundingSourceToJSON,
    FundingTime,
    FundingTimeFromJSON,
    FundingTimeFromJSONTyped,
    FundingTimeToJSON,
    FundingTimeSplit,
    FundingTimeSplitFromJSON,
    FundingTimeSplitFromJSONTyped,
    FundingTimeSplitToJSON,
    FundingTimeSplitUtilization,
    FundingTimeSplitUtilizationFromJSON,
    FundingTimeSplitUtilizationFromJSONTyped,
    FundingTimeSplitUtilizationToJSON,
    Organization,
    OrganizationFromJSON,
    OrganizationFromJSONTyped,
    OrganizationToJSON,
} from './';

/**
 * 
 * @export
 * @interface FundingSpace
 */
export interface FundingSpace {
    /**
     * 
     * @type {number}
     * @memberof FundingSpace
     */
    id: number;
    /**
     * 
     * @type {number}
     * @memberof FundingSpace
     */
    capacity: number;
    /**
     * 
     * @type {number}
     * @memberof FundingSpace
     */
    organizationId: number;
    /**
     * 
     * @type {Organization}
     * @memberof FundingSpace
     */
    organization?: Organization;
    /**
     * 
     * @type {FundingSource}
     * @memberof FundingSpace
     */
    source: FundingSource;
    /**
     * 
     * @type {Age}
     * @memberof FundingSpace
     */
    ageGroup: Age;
    /**
     * 
     * @type {Array<Funding>}
     * @memberof FundingSpace
     */
    fundings?: Array<Funding>;
    /**
     * 
     * @type {FundingTime}
     * @memberof FundingSpace
     */
    time: FundingTime;
    /**
     * 
     * @type {FundingTimeSplit}
     * @memberof FundingSpace
     */
    timeSplit?: FundingTimeSplit;
    /**
     * 
     * @type {Array<FundingTimeSplitUtilization>}
     * @memberof FundingSpace
     */
    timeSplitUtilizations?: Array<FundingTimeSplitUtilization>;
}

export function FundingSpaceFromJSON(json: any): FundingSpace {
    return FundingSpaceFromJSONTyped(json, false);
}

export function FundingSpaceFromJSONTyped(json: any, ignoreDiscriminator: boolean): FundingSpace {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'capacity': json['capacity'],
        'organizationId': json['organizationId'],
        'organization': !exists(json, 'organization') ? undefined : OrganizationFromJSON(json['organization']),
        'source': FundingSourceFromJSON(json['source']),
        'ageGroup': AgeFromJSON(json['ageGroup']),
        'fundings': !exists(json, 'fundings') ? undefined : ((json['fundings'] as Array<any>).map(FundingFromJSON)),
        'time': FundingTimeFromJSON(json['time']),
        'timeSplit': !exists(json, 'timeSplit') ? undefined : FundingTimeSplitFromJSON(json['timeSplit']),
        'timeSplitUtilizations': !exists(json, 'timeSplitUtilizations') ? undefined : ((json['timeSplitUtilizations'] as Array<any>).map(FundingTimeSplitUtilizationFromJSON)),
    };
}

export function FundingSpaceToJSON(value?: FundingSpace | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'capacity': value.capacity,
        'organizationId': value.organizationId,
        'organization': OrganizationToJSON(value.organization),
        'source': FundingSourceToJSON(value.source),
        'ageGroup': AgeToJSON(value.ageGroup),
        'fundings': value.fundings === undefined ? undefined : ((value.fundings as Array<any>).map(FundingToJSON)),
        'time': FundingTimeToJSON(value.time),
        'timeSplit': FundingTimeSplitToJSON(value.timeSplit),
        'timeSplitUtilizations': value.timeSplitUtilizations === undefined ? undefined : ((value.timeSplitUtilizations as Array<any>).map(FundingTimeSplitUtilizationToJSON)),
    };
}


