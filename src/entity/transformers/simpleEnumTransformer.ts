export const simpleEnumTransformer = (enumType: object) => ({
  from: (dbEnum?: string) => enumType[dbEnum],
  to: (entityEnum?: string) => {
    if (!entityEnum) return;

    const thisEnum = Object.entries(enumType).find(
      ([_, val]) => val === entityEnum
    );
    if (!thisEnum) throw new Error('Invalid enum value');

    return thisEnum[0];
  },
});
