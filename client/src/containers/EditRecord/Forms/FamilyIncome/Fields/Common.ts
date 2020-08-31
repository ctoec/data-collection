import { IncomeDetermination } from '../../../../../shared/models';

export type IncomeFormProps = {
  familyId: number;
  isFoster: boolean | undefined;
  hasDisclosed: boolean;
  determinations: IncomeDetermination[];
  refetchChild: () => void;
};

export type IncomeFormFieldProps = {
  determinationId: number;
};
