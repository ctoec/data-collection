/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import {
  Controller,
  ValidationService,
  FieldErrors,
  ValidateError,
  TsoaRoute,
  HttpStatusCodeLiteral,
  TsoaResponse,
} from 'tsoa';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ReportController } from './../controllers/report/ReportController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserController } from './../controllers/user/UserController';
import { expressAuthentication } from './../middleware/authenticate';
import * as express from 'express';

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
  Region: {
    dataType: 'refEnum',
    enums: ['East', 'NorthCentral', 'NorthWest', 'SouthCentral', 'SouthWest'],
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  Organization: {
    dataType: 'refObject',
    properties: {
      id: { dataType: 'double', required: true },
      name: { dataType: 'string', required: true },
      sites: { dataType: 'array', array: { ref: 'Site' } },
      fundingSpaces: { dataType: 'array', array: { ref: 'FundingSpace' } },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  Gender: {
    dataType: 'refEnum',
    enums: ['Male', 'Female', 'Nonbinary', 'Unknown', 'Unspecified'],
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  Child: {
    dataType: 'refObject',
    properties: {
      id: { dataType: 'string', required: true },
      sasid: { dataType: 'string' },
      firstName: { dataType: 'string', required: true },
      middleName: { dataType: 'string' },
      lastName: { dataType: 'string', required: true },
      suffix: { dataType: 'string' },
      birthdate: { dataType: 'datetime' },
      birthTown: { dataType: 'string' },
      birthState: { dataType: 'string' },
      birthCertificateId: { dataType: 'string' },
      americanIndianOrAlaskaNative: { dataType: 'boolean' },
      asian: { dataType: 'boolean' },
      blackOrAfricanAmerican: { dataType: 'boolean' },
      nativeHawaiianOrPacificIslander: { dataType: 'boolean' },
      white: { dataType: 'boolean' },
      hispanicOrLatinxEthnicity: { dataType: 'boolean' },
      gender: { ref: 'Gender' },
      foster: { dataType: 'boolean' },
      familyId: { dataType: 'double' },
      family: { ref: 'Family' },
      enrollments: { dataType: 'array', array: { ref: 'Enrollment' } },
      organizationId: { dataType: 'double', required: true },
      organization: { ref: 'Organization' },
      c4KFamilyCaseNumber: { dataType: 'double' },
      c4KCertificates: { dataType: 'array', array: { ref: 'C4KCertificate' } },
      authorId: { dataType: 'double' },
      author: { ref: 'User' },
      updatedAt: { dataType: 'datetime' },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  Family: {
    dataType: 'refObject',
    properties: {
      id: { dataType: 'double', required: true },
      children: { dataType: 'array', array: { ref: 'Child' } },
      addressLine1: { dataType: 'string' },
      addressLine2: { dataType: 'string' },
      town: { dataType: 'string' },
      state: { dataType: 'string' },
      zip: { dataType: 'string' },
      homelessness: { dataType: 'boolean' },
      determinations: {
        dataType: 'array',
        array: { ref: 'FamilyDetermination' },
      },
      organizationId: { dataType: 'double', required: true },
      organization: { ref: 'Organization' },
      authorId: { dataType: 'double' },
      author: { ref: 'User' },
      updatedAt: { dataType: 'datetime' },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  User: {
    dataType: 'refObject',
    properties: {
      id: { dataType: 'double', required: true },
      wingedKeysId: { dataType: 'string', required: true },
      firstName: { dataType: 'string', required: true },
      lastName: { dataType: 'string', required: true },
      middleName: { dataType: 'string' },
      suffix: { dataType: 'string' },
      orgPermissions: {
        dataType: 'array',
        array: { ref: 'OrganizationPermission' },
      },
      sitePermissions: { dataType: 'array', array: { ref: 'SitePermission' } },
      sites: { dataType: 'array', array: { ref: 'Site' } },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  FamilyDetermination: {
    dataType: 'refObject',
    properties: {
      id: { dataType: 'double', required: true },
      numberOfPeople: { dataType: 'double' },
      income: { dataType: 'double' },
      determinationDate: { dataType: 'datetime' },
      familyId: { dataType: 'double', required: true },
      family: { ref: 'Family' },
      authorId: { dataType: 'double' },
      author: { ref: 'User' },
      updatedAt: { dataType: 'datetime' },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  Enrollment: {
    dataType: 'refObject',
    properties: {
      id: { dataType: 'double', required: true },
      childId: { dataType: 'string', required: true },
      child: { ref: 'Child' },
      siteId: { dataType: 'double', required: true },
      site: { ref: 'Site' },
      ageGroup: { ref: 'Age' },
      entry: { dataType: 'datetime' },
      exit: { dataType: 'datetime' },
      exitReason: { dataType: 'string' },
      fundings: { dataType: 'array', array: { ref: 'Funding' } },
      pastEnrollments: { dataType: 'array', array: { ref: 'Enrollment' } },
      authorId: { dataType: 'double' },
      author: { ref: 'User' },
      updatedAt: { dataType: 'datetime' },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  C4KCertificate: {
    dataType: 'refObject',
    properties: {
      id: { dataType: 'double', required: true },
      childId: { dataType: 'string', required: true },
      child: { ref: 'Child' },
      startDate: { dataType: 'datetime' },
      endDate: { dataType: 'datetime' },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  Site: {
    dataType: 'refObject',
    properties: {
      id: { dataType: 'double', required: true },
      name: { dataType: 'string', required: true },
      titleI: { dataType: 'boolean', required: true },
      region: { ref: 'Region', required: true },
      organizationId: { dataType: 'double', required: true },
      organization: { ref: 'Organization' },
      facilityCode: { dataType: 'double' },
      licenseNumber: { dataType: 'double' },
      naeycId: { dataType: 'double' },
      registryId: { dataType: 'double' },
      enrollments: { dataType: 'array', array: { ref: 'Enrollment' } },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  Age: {
    dataType: 'refEnum',
    enums: ['InfantToddler', 'Preschool', 'SchoolAge'],
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  FundingSource: {
    dataType: 'refEnum',
    enums: ['CDC'],
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  Funding: {
    dataType: 'refObject',
    properties: {
      id: { dataType: 'double', required: true },
      enrollmentId: { dataType: 'double', required: true },
      enrollment: { ref: 'Enrollment' },
      fundingSpace: { ref: 'FundingSpace' },
      fundingSpaceId: { dataType: 'double', required: true },
      source: { ref: 'FundingSource' },
      firstReportingPeriodId: { dataType: 'double' },
      firstReportingPeriod: { ref: 'ReportingPeriod' },
      lastReportingPeriodId: { dataType: 'double' },
      lastReportingPeriod: { ref: 'ReportingPeriod' },
      authorId: { dataType: 'double' },
      author: { ref: 'User' },
      updatedAt: { dataType: 'datetime' },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  FundingTime: {
    dataType: 'refEnum',
    enums: ['Full', 'Part', 'Split'],
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  FundingSpace: {
    dataType: 'refObject',
    properties: {
      id: { dataType: 'double', required: true },
      capacity: { dataType: 'double', required: true },
      organizationId: { dataType: 'double', required: true },
      organization: { ref: 'Organization' },
      source: { ref: 'FundingSource', required: true },
      ageGroup: { ref: 'Age', required: true },
      fundings: { dataType: 'array', array: { ref: 'Funding' } },
      time: { ref: 'FundingTime', required: true },
      timeSplit: { ref: 'FundingTimeSplit' },
      timeSplitUtilizations: {
        dataType: 'array',
        array: { ref: 'FundingTimeSplitUtilization' },
      },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  FundingTimeSplit: {
    dataType: 'refObject',
    properties: {
      id: { dataType: 'double', required: true },
      fundingSpaceId: { dataType: 'double', required: true },
      fundingSpace: { ref: 'FundingSpace' },
      fullTimeWeeks: { dataType: 'double', required: true },
      partTimeWeeks: { dataType: 'double', required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  ReportingPeriod: {
    dataType: 'refObject',
    properties: {
      id: { dataType: 'double', required: true },
      type: { ref: 'FundingSource', required: true },
      period: { dataType: 'datetime', required: true },
      periodStart: { dataType: 'datetime', required: true },
      periodEnd: { dataType: 'datetime', required: true },
      dueAt: { dataType: 'datetime', required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  FundingTimeSplitUtilization: {
    dataType: 'refObject',
    properties: {
      id: { dataType: 'double', required: true },
      reportingPeriodId: { dataType: 'double', required: true },
      reportingPeriod: { ref: 'ReportingPeriod' },
      reportId: { dataType: 'double', required: true },
      report: { ref: 'CdcReport' },
      fundingSpaceId: { dataType: 'double', required: true },
      fundingSpace: { ref: 'FundingSpace' },
      fullTimeWeeksUsed: { dataType: 'double', required: true },
      partTimeWeeksUsed: { dataType: 'double', required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  CdcReport: {
    dataType: 'refObject',
    properties: {
      accredited: { dataType: 'boolean', required: true },
      c4KRevenue: { dataType: 'double', required: true },
      retroactiveC4KRevenue: { dataType: 'boolean' },
      familyFeesRevenue: { dataType: 'double', required: true },
      comment: { dataType: 'string' },
      timeSplitUtilizations: {
        dataType: 'array',
        array: { ref: 'FundingTimeSplitUtilization' },
      },
      organizationId: { dataType: 'double', required: true },
      organization: { ref: 'Organization' },
      id: { dataType: 'double', required: true },
      type: { ref: 'FundingSource' },
      reportingPeriodId: { dataType: 'double', required: true },
      reportingPeriod: { ref: 'ReportingPeriod', required: true },
      submittedAt: { dataType: 'datetime' },
      enrollments: { dataType: 'array', array: { ref: 'Enrollment' } },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  OrganizationPermission: {
    dataType: 'refObject',
    properties: {
      organizationId: { dataType: 'double', required: true },
      organization: { ref: 'Organization' },
      id: { dataType: 'double', required: true },
      userId: { dataType: 'double', required: true },
      user: { ref: 'User' },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  SitePermission: {
    dataType: 'refObject',
    properties: {
      siteId: { dataType: 'double', required: true },
      site: { ref: 'Site' },
      id: { dataType: 'double', required: true },
      userId: { dataType: 'double', required: true },
      user: { ref: 'User' },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const validationService = new ValidationService(models);

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: express.Express) {
  // ###########################################################################################################
  //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
  //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
  // ###########################################################################################################
  app.get(
    '/api/reports/:reportId',
    authenticateMiddleware([{ jwt: [] }]),
    function (request: any, response: any, next: any) {
      const args = {
        reportId: {
          in: 'path',
          name: 'reportId',
          required: true,
          dataType: 'string',
        },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new ReportController();

      const promise = controller.get.apply(controller, validatedArgs as any);
      promiseHandler(controller, promise, response, next);
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.post('/api/reports', authenticateMiddleware([{ jwt: [] }]), function (
    request: any,
    response: any,
    next: any
  ) {
    const args = {
      req: { in: 'request', name: 'req', required: true, dataType: 'object' },
    };

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    let validatedArgs: any[] = [];
    try {
      validatedArgs = getValidatedArgs(args, request, response);
    } catch (err) {
      return next(err);
    }

    const controller = new ReportController();

    const promise = controller.post.apply(controller, validatedArgs as any);
    promiseHandler(controller, promise, response, next);
  });
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.get(
    '/api/users/current',
    authenticateMiddleware([{ jwt: [] }]),
    function (request: any, response: any, next: any) {
      const args = {
        req: { in: 'request', name: 'req', required: true, dataType: 'object' },
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = getValidatedArgs(args, request, response);
      } catch (err) {
        return next(err);
      }

      const controller = new UserController();

      const promise = controller.getCurrentUser.apply(
        controller,
        validatedArgs as any
      );
      promiseHandler(controller, promise, response, next);
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
    return (request: any, _response: any, next: any) => {
      let responded = 0;
      let success = false;

      const succeed = function (user: any) {
        if (!success) {
          success = true;
          responded++;
          request['user'] = user;
          next();
        }
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      const fail = function (error: any) {
        responded++;
        if (responded == security.length && !success) {
          error.status = error.status || 401;
          next(error);
        }
      };

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      for (const secMethod of security) {
        if (Object.keys(secMethod).length > 1) {
          let promises: Promise<any>[] = [];

          for (const name in secMethod) {
            promises.push(
              expressAuthentication(request, name, secMethod[name])
            );
          }

          Promise.all(promises)
            .then((users) => {
              succeed(users[0]);
            })
            .catch(fail);
        } else {
          for (const name in secMethod) {
            expressAuthentication(request, name, secMethod[name])
              .then(succeed)
              .catch(fail);
          }
        }
      }
    };
  }

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  function isController(object: any): object is Controller {
    return (
      'getHeaders' in object && 'getStatus' in object && 'setStatus' in object
    );
  }

  function promiseHandler(
    controllerObj: any,
    promise: any,
    response: any,
    next: any
  ) {
    return Promise.resolve(promise)
      .then((data: any) => {
        let statusCode;
        let headers;
        if (isController(controllerObj)) {
          headers = controllerObj.getHeaders();
          statusCode = controllerObj.getStatus();
        }

        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

        returnHandler(response, statusCode, data, headers);
      })
      .catch((error: any) => next(error));
  }

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  function returnHandler(
    response: any,
    statusCode?: number,
    data?: any,
    headers: any = {}
  ) {
    Object.keys(headers).forEach((name: string) => {
      response.set(name, headers[name]);
    });
    if (
      data &&
      typeof data.pipe === 'function' &&
      data.readable &&
      typeof data._read === 'function'
    ) {
      data.pipe(response);
    } else if (data || data === false) {
      // === false allows boolean result
      response.status(statusCode || 200).json(data);
    } else {
      response.status(statusCode || 204).end();
    }
  }

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  function responder(
    response: any
  ): TsoaResponse<HttpStatusCodeLiteral, unknown> {
    return function (status, data, headers) {
      returnHandler(response, status, data, headers);
    };
  }

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  function getValidatedArgs(args: any, request: any, response: any): any[] {
    const fieldErrors: FieldErrors = {};
    const values = Object.keys(args).map((key) => {
      const name = args[key].name;
      switch (args[key].in) {
        case 'request':
          return request;
        case 'query':
          return validationService.ValidateParam(
            args[key],
            request.query[name],
            name,
            fieldErrors,
            undefined,
            { noImplicitAdditionalProperties: 'throw-on-extras' }
          );
        case 'path':
          return validationService.ValidateParam(
            args[key],
            request.params[name],
            name,
            fieldErrors,
            undefined,
            { noImplicitAdditionalProperties: 'throw-on-extras' }
          );
        case 'header':
          return validationService.ValidateParam(
            args[key],
            request.header(name),
            name,
            fieldErrors,
            undefined,
            { noImplicitAdditionalProperties: 'throw-on-extras' }
          );
        case 'body':
          return validationService.ValidateParam(
            args[key],
            request.body,
            name,
            fieldErrors,
            undefined,
            { noImplicitAdditionalProperties: 'throw-on-extras' }
          );
        case 'body-prop':
          return validationService.ValidateParam(
            args[key],
            request.body[name],
            name,
            fieldErrors,
            'body.',
            { noImplicitAdditionalProperties: 'throw-on-extras' }
          );
        case 'res':
          return responder(response);
      }
    });

    if (Object.keys(fieldErrors).length > 0) {
      throw new ValidateError(fieldErrors, '');
    }
    return values;
  }

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
