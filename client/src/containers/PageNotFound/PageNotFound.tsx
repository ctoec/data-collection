import React from 'react';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';

export default function PageNotFound() {
  const h1Ref = getH1RefForTitle();
  return (
    <div className="PageNotFound grid-container">
      <h1 ref={h1Ref}>Page not found</h1>
    </div>
  );
}
