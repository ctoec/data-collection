import {
  BirthCertificateType,
} from '../../../client/src/shared/models';

export const birthCertificateTransformer = (birthState) => ({
  from: (dbEnum?: string) => BirthCertificateType[dbEnum],
  to: (entityEnum?: string) => {
    console.log("%%%%%%%%%%%%%%%%%%%%%%");
    console.log(birthState);
    console.log("%%%%%%%%%%%%%%%%%%%%%%");
    if (!entityEnum) return;

    const [enumKey] = Object.entries(BirthCertificateType).find(
      ([_, enumVal]) => enumVal === entityEnum
    );

    if (!enumKey) throw new Error('Invalid enum value: `${entityEnum}`');

    return enumKey;
  },
});
