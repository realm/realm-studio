////////////////////////////////////////////////////////////////////////////
//
// Copyright 2018 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

import * as React from 'react';

import './ErrorOverlay.scss';

interface IErrorOverlayProps {
  error: Error;
  info: React.ErrorInfo;
  eventId?: string;
}

export const ErrorOverlay = ({ error, info, eventId }: IErrorOverlayProps) => {
  const body = encodeURIComponent(`Sentry ID: ${eventId}`);
  const gitHubUrl = `https://github.com/realm/realm-studio/issues/new?body=${body}`;
  return (
    <div className="ErrorOverlay">
      <p className="ErrorOverlay__Introduction">
        💥 Realm Studio encountered an unrecoverable error! 💥
      </p>
      {eventId ? <p className="ErrorOverlay__Id">ID: “{eventId}”</p> : null}
      {eventId ? (
        <p className="ErrorOverlay__IdExplanation">
          Send this id our way to help us fix your issue - or{' '}
          <a href={gitHubUrl} target="_blank">
            click here to create an issue on GitHub
          </a>
        </p>
      ) : null}
      <pre className="ErrorOverlay__Stack">
        {error.stack + info.componentStack}
      </pre>
    </div>
  );
};
