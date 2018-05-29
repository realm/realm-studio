import * as React from 'react';

import realmLogo from '../../../../static/svgs/realm-logo.svg';

export const Logo = () => (
  <svg viewBox={realmLogo.viewBox} className="TopBar__Logo">
    <use xlinkHref={`#${realmLogo.id}`} />
  </svg>
);
