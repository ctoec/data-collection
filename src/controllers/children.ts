import { getManager } from 'typeorm';
import { Child } from '../entity';

export const getChildById = (id: string) => {
  return getManager().findOne(Child, {
    where: { id },
    relations: [
      'family',
      'family.incomeDeterminations',
      'enrollments',
      'enrollments.fundings',
    ],
  });
};
