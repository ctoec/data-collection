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
    Child,
    ChildFromJSON,
    ChildFromJSONTyped,
    ChildToJSON,
} from './';

/**
 * 
 * @export
 * @interface C4KCertificate
 */
export interface C4KCertificate {
    /**
     * 
     * @type {number}
     * @memberof C4KCertificate
     */
    id: number;
    /**
     * 
     * @type {string}
     * @memberof C4KCertificate
     */
    childId: string;
    /**
     * 
     * @type {Child}
     * @memberof C4KCertificate
     */
    child?: Child;
    /**
     * 
     * @type {Date}
     * @memberof C4KCertificate
     */
    startDate?: Date;
    /**
     * 
     * @type {Date}
     * @memberof C4KCertificate
     */
    endDate?: Date;
}

export function C4KCertificateFromJSON(json: any): C4KCertificate {
    return C4KCertificateFromJSONTyped(json, false);
}

export function C4KCertificateFromJSONTyped(json: any, ignoreDiscriminator: boolean): C4KCertificate {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'childId': json['childId'],
        'child': !exists(json, 'child') ? undefined : ChildFromJSON(json['child']),
        'startDate': !exists(json, 'startDate') ? undefined : (new Date(json['startDate'])),
        'endDate': !exists(json, 'endDate') ? undefined : (new Date(json['endDate'])),
    };
}

export function C4KCertificateToJSON(value?: C4KCertificate | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'childId': value.childId,
        'child': ChildToJSON(value.child),
        'startDate': value.startDate === undefined ? undefined : (value.startDate.toISOString()),
        'endDate': value.endDate === undefined ? undefined : (value.endDate.toISOString()),
    };
}


