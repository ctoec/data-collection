export const enumTransformer = (enumType: object) => ({
  from: (dbEnum?: string) => enumType[dbEnum],
  to: (entityEnum?: string) => {
    if (!entityEnum) return;

    const [enumKey] = Object.entries(enumType).find(
      ([_, enumVal]) => enumVal === entityEnum
    );

    if (!enumKey) throw new Error('Invalid enum value: `${entityEnum}`');

    return enumKey;
  },
});
