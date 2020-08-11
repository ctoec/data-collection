import { AgeGroup, Child, Funding, Site } from '.';

export interface Enrollment {
  id: number;
  child: Child;
  site: Site;
  ageGroup?: AgeGroup;
  entry?: Date;
  exit?: Date;
  exitReason?: string;
  fundings?: Array<Funding>;
}
