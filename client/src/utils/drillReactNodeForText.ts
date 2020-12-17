import React from 'react';
import { ReactNode } from 'react';

export function drillReactNodeForText(inputNode: ReactNode | string): string {
  if (typeof inputNode === 'string') {
    return inputNode;
  } else if (React.isValidElement(inputNode)) {
    return drillReactNodeForText(inputNode.props.children);
  }
  return '';
}
