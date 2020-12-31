import React from 'react';

const orderedHeadingLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;
export type HeadingLevel = typeof orderedHeadingLevels[number];

export type HeadingProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
> & {
  level: HeadingLevel;
};

/**
 * Allows heading to be dynamically defined in reused components so that headings are always properly nested to indicate document structure.
 * See
 */
export const Heading = ({ level, children, ...props }: HeadingProps) => {
  const H = level;
  return <H {...props}>{children}</H>;
};

export const getNextHeadingLevel = (
  levelUp: HeadingLevel,
  numberOfLevelsToAdd = 1
): HeadingLevel =>
  orderedHeadingLevels[
    orderedHeadingLevels.indexOf(levelUp) + numberOfLevelsToAdd
  ] as HeadingLevel;
