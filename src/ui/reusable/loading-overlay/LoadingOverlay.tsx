import * as React from "react";

import "./LoadingOverlay.scss";

/**
 * An absolutly positioned loading overlay with three animated dots.
 * @param options.loading Is it loading?
 * @param options.fade Delay and fade in the overlay, prevent flickering when the load is fast.
 */
export default ({
  loading,
  fade = true,
}: {
  loading: boolean,
  fade?: boolean,
}) => {
  const classNames = ["LoadingOverlay"];
  if (!fade) {
    classNames.push("LoadingOverlay--no-fade");
  }
  return loading ? (
    <div className={classNames.join(" ")}>
      <svg className="LoadingOverlay__svg"
        width="60px" height="20px" viewBox="-5 -5 60 20" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <g>
          <circle fill="currentColor" className="LoadingOverlay__dot-1" cx="5" cy="5" r="5" />
          <circle fill="currentColor" className="LoadingOverlay__dot-2" cx="25" cy="5" r="5" />
          <circle fill="currentColor" className="LoadingOverlay__dot-3" cx="45" cy="5" r="5" />
        </g>
      </svg>
    </div>
  ) : null;
};
