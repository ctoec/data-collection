import { Moment } from 'moment';
import { ColumnMetadata } from '../models';

export interface TemplateMetadataResponse {
  version: 1 | 2;
  lastUpdated: Moment;
  columnMetadata: ColumnMetadata[];
}
