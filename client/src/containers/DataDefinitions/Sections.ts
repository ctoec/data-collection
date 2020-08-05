// TO DO: also get this from the backend
export const SECTIONS = {
  CHILD_INFO: 'child-info',
  FAMILY_INFO: 'family-info',
  FAMILY_INCOME: 'family-income',
  ENROLLMENT_FUNDING: 'enrollment-funding',
};

type SectionInfo = { formattedName: string; description: string };
export const SECTION_COPY: { [key: string]: SectionInfo } = {};
SECTION_COPY[SECTIONS.CHILD_INFO] = {
  formattedName: 'Child info',
  description: 'A unique person enrolled in an ECE program.',
};
SECTION_COPY[SECTIONS.FAMILY_INFO] = {
  formattedName: 'Family info',
  description:
    'One or more children that share the same address and household income.',
};
SECTION_COPY[SECTIONS.FAMILY_INCOME] = {
  formattedName: 'Family income determination',
  description:
    "A determination by a provider of a family's income, for purposes of assessing eligibility for public funding; must be updated at least once a year.",
};
SECTION_COPY[SECTIONS.ENROLLMENT_FUNDING] = {
  formattedName: 'Enrollment and funding',
  description:
    'Enrollment: A period of time during which a child recieved ECE services.\nFunding: A period of time during which an enrollment was subsidized by a state-funded contract space.\nCare 4 Kids: Whether or not the enrollment was subsidized by the Care 4 Kids program.',
};
