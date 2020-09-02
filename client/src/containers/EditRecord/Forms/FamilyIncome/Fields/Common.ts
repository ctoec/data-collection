import { IncomeDetermination } from '../../../../../shared/models';

/**
 * Generic type to hold the props of the high-level income forms,
 * specifically to allow indexing into the desire determination as
 * well as persisting back to the DB.
 */
export type IncomeFormProps = {
  familyId: number;
  determinations: IncomeDetermination[];
  refetchChild: () => void;
};
