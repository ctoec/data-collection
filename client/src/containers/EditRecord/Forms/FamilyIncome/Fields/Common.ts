import { IncomeDetermination } from '../../../../../shared/models';

export type IncomeFormProps = {
  familyId: number;
  isFoster: boolean;
  determinations: IncomeDetermination[];
  refetchChild: () => void;
};
