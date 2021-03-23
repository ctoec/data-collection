export const nullTransformer = {
  from: (text?: string) => {
    return text === '' ? null : text;
  },
  to: (text?: string) => {
    return text === '' ? null : text;
  },
};
