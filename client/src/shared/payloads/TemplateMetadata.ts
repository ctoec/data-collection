import { Moment } from 'moment';
import { ColumnMetadata } from '../models';

export interface TemplateMetadata {
  version: 1;
  lastUpdated: Moment;
  columnMetadata: ColumnMetadata[];
}
