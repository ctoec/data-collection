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

import * as runtime from '../runtime';
import {
  EnrollmentReport,
  EnrollmentReportFromJSON,
  EnrollmentReportToJSON,
  User,
  UserFromJSON,
  UserToJSON,
} from '../models';

export interface CreateReportRequest {
  file?: Blob;
}

export interface GetReportByIdRequest {
  reportId: number;
}

/**
 * no description
 */
export class DefaultApi extends runtime.BaseAPI {
  /**
   */
  async createReportRaw(
    requestParameters: CreateReportRequest
  ): Promise<runtime.ApiResponse<EnrollmentReport>> {
    const queryParameters: runtime.HTTPQuery = {};

    const headerParameters: runtime.HTTPHeaders = {};

    if (this.configuration && this.configuration.apiKey) {
      headerParameters['Authorization'] = this.configuration.apiKey(
        'Authorization'
      ); // jwt authentication
    }

    const consumes: runtime.Consume[] = [
      { contentType: 'multipart/form-data' },
    ];
    // @ts-ignore: canConsumeForm may be unused
    const canConsumeForm = runtime.canConsumeForm(consumes);

    let formParams: { append(param: string, value: any): any };
    let useForm = false;
    // use FormData to transmit files using content-type "multipart/form-data"
    useForm = canConsumeForm;
    if (useForm) {
      formParams = new FormData();
    } else {
      formParams = new URLSearchParams();
    }

    if (requestParameters.file !== undefined) {
      formParams.append('file', requestParameters.file as any);
    }

    const response = await this.request({
      path: `/reports`,
      method: 'POST',
      headers: headerParameters,
      query: queryParameters,
      body: formParams,
    });

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      EnrollmentReportFromJSON(jsonValue)
    );
  }

  /**
   */
  async createReport(
    requestParameters: CreateReportRequest
  ): Promise<EnrollmentReport> {
    const response = await this.createReportRaw(requestParameters);
    return await response.value();
  }

  /**
   */
  async getCurrentUserRaw(): Promise<runtime.ApiResponse<User>> {
    const queryParameters: runtime.HTTPQuery = {};

    const headerParameters: runtime.HTTPHeaders = {};

    if (this.configuration && this.configuration.apiKey) {
      headerParameters['Authorization'] = this.configuration.apiKey(
        'Authorization'
      ); // jwt authentication
    }

    const response = await this.request({
      path: `/users/current`,
      method: 'GET',
      headers: headerParameters,
      query: queryParameters,
    });

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      UserFromJSON(jsonValue)
    );
  }

  /**
   */
  async getCurrentUser(): Promise<User> {
    const response = await this.getCurrentUserRaw();
    return await response.value();
  }

  /**
   */
  async getReportByIdRaw(
    requestParameters: GetReportByIdRequest
  ): Promise<runtime.ApiResponse<EnrollmentReport>> {
    if (
      requestParameters.reportId === null ||
      requestParameters.reportId === undefined
    ) {
      throw new runtime.RequiredError(
        'reportId',
        'Required parameter requestParameters.reportId was null or undefined when calling getReportById.'
      );
    }

    const queryParameters: runtime.HTTPQuery = {};

    const headerParameters: runtime.HTTPHeaders = {};

    if (this.configuration && this.configuration.apiKey) {
      headerParameters['Authorization'] = this.configuration.apiKey(
        'Authorization'
      ); // jwt authentication
    }

    const response = await this.request({
      path: `/reports/{reportId}`.replace(
        `{${'reportId'}}`,
        encodeURIComponent(String(requestParameters.reportId))
      ),
      method: 'GET',
      headers: headerParameters,
      query: queryParameters,
    });

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      EnrollmentReportFromJSON(jsonValue)
    );
  }

  /**
   */
  async getReportById(
    requestParameters: GetReportByIdRequest
  ): Promise<EnrollmentReport> {
    const response = await this.getReportByIdRaw(requestParameters);
    return await response.value();
  }
}
