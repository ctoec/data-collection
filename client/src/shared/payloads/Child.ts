import { Child } from '../models';

export interface ListChildReponse {
  children: Child[];
  totalCount: number;
}