import * as React from 'react';

import realmFileIcon from '../../../../static/svgs/synced-realm-icon.svg';

export const DraggingFileOverlay = () => (
  <div className="RealmsTable__DraggingFileOverlay">
    {/* // FIXME: The SVG is not rendering correctly
    <svg
      viewBox={realmFileIcon.viewBox}
      className="RealmsTable__DraggingFileOverlay__Icon"
    >
      <use xlinkHref={realmFileIcon.url} />
    </svg>
    */}
    <p>Drag-drop a .realm file will upload it to the server</p>
  </div>
);
