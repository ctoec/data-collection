import 'reflect-metadata';

const templateMetadataKey = Symbol('templateMeta');

// descriptions
export const TEXT_DESCRIPTION = 'Text';
export const NUMBER_DESCRIPTION = 'Number';
export const DATE_DESCRIPTION =
  "Date like 'MM/DD/YYYY', 'MM/DD/YY', 'MM-DD-YYYY', 'MM-DD-YY', 'YYYY-MM-DD', 'YY-MM-DD'";
export const BOOLEAN_DESCRIPTION =
  "'Yes', 'yes', 'Y', 'y', 'No', 'no', 'N', 'n'";

// sections

export type TemplateMetadata = {
  title: string;
  description: string;
  section: string;
};

export const TemplateMeta = (metaData: TemplateMetadata) =>
  Reflect.metadata(templateMetadataKey, metaData);

export const getTemplateMeta: (_: any, __: string) => TemplateMetadata = (
  target: any,
  propertyKey: string
) => Reflect.getMetadata(templateMetadataKey, target, propertyKey);
