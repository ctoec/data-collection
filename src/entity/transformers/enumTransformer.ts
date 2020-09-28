export const enumTransformer = (enumType: object) => {
  const enumValues = Object.values(enumType);
  return {
    from: (dbEnum?: number) => {
      if (dbEnum < enumValues.length) return enumValues[dbEnum];
    },
    to: (entityEnum?: string) => {
      return enumValues.findIndex((val) => val === entityEnum);
    },
  };
};
