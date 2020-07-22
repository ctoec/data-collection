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
    User,
    UserFromJSON,
    UserFromJSONTyped,
    UserToJSON,
} from './';

/**
 * 
 * @export
 * @interface FamilyDetermination
 */
export interface FamilyDetermination {
    /**
     * 
     * @type {number}
     * @memberof FamilyDetermination
     */
    id: number;
    /**
     * 
     * @type {number}
     * @memberof FamilyDetermination
     */
    numberOfPeople?: number;
    /**
     * 
     * @type {number}
     * @memberof FamilyDetermination
     */
    income?: number;
    /**
     * 
     * @type {Date}
     * @memberof FamilyDetermination
     */
    determinationDate?: Date;
    /**
     * 
     * @type {number}
     * @memberof FamilyDetermination
     */
    familyId: number;
    /**
     * 
     * @type {Family}
     * @memberof FamilyDetermination
     */
    family?: Family;
    /**
     * 
     * @type {number}
     * @memberof FamilyDetermination
     */
    authorId?: number;
    /**
     * 
     * @type {User}
     * @memberof FamilyDetermination
     */
    author?: User;
    /**
     * 
     * @type {Date}
     * @memberof FamilyDetermination
     */
    updatedAt?: Date;
}

export function FamilyDeterminationFromJSON(json: any): FamilyDetermination {
    return FamilyDeterminationFromJSONTyped(json, false);
}

export function FamilyDeterminationFromJSONTyped(json: any, ignoreDiscriminator: boolean): FamilyDetermination {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'numberOfPeople': !exists(json, 'numberOfPeople') ? undefined : json['numberOfPeople'],
        'income': !exists(json, 'income') ? undefined : json['income'],
        'determinationDate': !exists(json, 'determinationDate') ? undefined : (new Date(json['determinationDate'])),
        'familyId': json['familyId'],
        'family': !exists(json, 'family') ? undefined : FamilyFromJSON(json['family']),
        'authorId': !exists(json, 'authorId') ? undefined : json['authorId'],
        'author': !exists(json, 'author') ? undefined : UserFromJSON(json['author']),
        'updatedAt': !exists(json, 'updatedAt') ? undefined : (new Date(json['updatedAt'])),
    };
}

export function FamilyDeterminationToJSON(value?: FamilyDetermination | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'numberOfPeople': value.numberOfPeople,
        'income': value.income,
        'determinationDate': value.determinationDate === undefined ? undefined : (value.determinationDate.toISOString()),
        'familyId': value.familyId,
        'family': FamilyToJSON(value.family),
        'authorId': value.authorId,
        'author': UserToJSON(value.author),
        'updatedAt': value.updatedAt === undefined ? undefined : (value.updatedAt.toISOString()),
    };
}


