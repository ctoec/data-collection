export const simpleEnumTransformer = (enumType: object) => ({
  from: (enumKey?: string) => enumType[enumKey],
  to: (enumValue?: string) => {
    const thisEnum = Object.entries(enumType).find(
      ([_, val]) => val === enumValue
    );
    if (!thisEnum) throw new Error('Invalid enum value');
    return thisEnum[0];
  },
});
