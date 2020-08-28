import { IncomeDetermination } from '../../../../../shared/models';

export type IncomeFormProps = {
  familyId: number;
  isFoster: boolean;
  hasDisclosed: boolean;
  determinations: IncomeDetermination[];
  refetchChild: () => void;
};
