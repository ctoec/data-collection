import React from 'react';

const orderedHeadingLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;
export type HeadingLevel = typeof orderedHeadingLevels[number];

type HeadingProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
> & {
  level: HeadingLevel;
};
export const Heading = ({ level, children }: HeadingProps) => {
  const H = level;
  return <H>{children}</H>;
};

export const getNextHeaderLevel = (levelUp: HeadingLevel): HeadingLevel =>
  orderedHeadingLevels[
    orderedHeadingLevels.indexOf(levelUp) + 1
  ] as HeadingLevel;
