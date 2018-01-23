import * as React from 'react';

interface IPlatformOverlay {
  onClose: () => void;
}

export const PlatformOverlay = ({ onClose }: IPlatformOverlay) => (
  <section className="Dashboard__PlatformOverlay">
    <i
      className="Dashboard__PlatformOverlay__Close fa fa-close"
      onClick={onClose}
    />
  </section>
);
