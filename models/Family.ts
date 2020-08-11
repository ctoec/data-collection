import { Child, IncomeDetermination, Organization } from './';

export interface Family {
  id: number;
  /**
   *
   * @type {string}
   * @memberof Family
   */
  addressLine1?: string;
  /**
   *
   * @type {string}
   * @memberof Family
   */
  addressLine2?: string;
  /**
   *
   * @type {string}
   * @memberof Family
   */
  town?: string;
  /**
   *
   * @type {string}
   * @memberof Family
   */
  state?: string;
  /**
   *
   * @type {string}
   * @memberof Family
   */
  zip?: string;
  /**
   *
   * @type {boolean}
   * @memberof Family
   */
  homelessness?: boolean;
  /**
   *
   * @type {Array<IncomeDetermination>}
   * @memberof Family
   */
  incomeDeterminations?: Array<IncomeDetermination>;
  /**
   *
   * @type {Array<Child>}
   * @memberof Family
   */
  children?: Array<Child>;
  /**
   *
   * @type {Organization}
   * @memberof Family
   */
  organization?: Organization;
  /**
   *
   * @type {UpdateMetaData}
   * @memberof Family
   */
  updateMetaData?: UpdateMetaData;
}
