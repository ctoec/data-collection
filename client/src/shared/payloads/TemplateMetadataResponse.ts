import { Moment } from 'moment';
import { ColumnMetadata } from '../models';

export interface TemplateMetadataResponse {
  version: 1;
  lastUpdated: Moment;
  columnMetadata: ColumnMetadata[];
}
