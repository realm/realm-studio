import * as React from 'react';
import { Button, Input } from 'reactstrap';

import * as raas from '../../../services/raas';
import {
  ILoadingProgress,
  LoadingOverlay,
} from '../../reusable/loading-overlay';
import { SocialNetwork } from '../GreetingContainer';

export interface ICloudOverlayProps {
  isHidden: boolean;
  message: string;
  onHide: () => void;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onShare: (socialNetwork: SocialNetwork) => void;
  progress?: ILoadingProgress;
  showWaitingList: boolean;
  user: raas.user.IMeResponse;
}

export const CloudOverlay = ({
  isHidden,
  message,
  onHide,
  onMessageChange,
  onSendMessage,
  onShare,
  progress,
  showWaitingList,
  user,
}: ICloudOverlayProps) =>
  isHidden ? null : progress ? (
    <LoadingOverlay progress={progress} />
  ) : showWaitingList ? (
    <section className="Greeting__CloudOverlay">
      <h2 className="Greeting__CloudOverlay__Title">
        Realm Cloud is on the rise!
      </h2>
      <p>
        If you want to be among the first to get access, please help us spread
        the word and let us learn what you would use it for:
      </p>
      <div className="Greeting__CloudOverlay__ShareButtons">
        <Button onClick={() => onShare('twitter')} size="sm">
          <i className="fa fa-twitter" /> Tweet about it
        </Button>
        <Button onClick={() => onShare('facebook')} size="sm">
          <i className="fa fa-facebook" /> Share on Facebook
        </Button>
      </div>
      <div className="Greeting__CloudOverlay__ShareButtons">
        <Button onClick={() => onShare('reddit')} size="sm">
          <i className="fa fa-reddit" /> Upvote on Reddit
        </Button>
        <Button onClick={() => onShare('hacker-news')} size="sm">
          <i className="fa fa-hacker-news" /> Upvote on Hacker News
        </Button>
      </div>
      <Input
        className="Greeting__CloudOverlay__Feedback"
        type="textarea"
        placeholder="I want to use it for ..."
        required={true}
        onChange={e => onMessageChange(e.target.value)}
      />
      <div className="Greeting__CloudOverlay__Footer">
        <Button color="secondary" size="sm" onClick={onHide}>
          No thanks
        </Button>
        <Button color="primary" size="sm" onClick={onSendMessage}>
          Send message
        </Button>
      </div>
    </section>
  ) : null;
