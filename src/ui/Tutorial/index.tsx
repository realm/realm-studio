import * as React from 'react';

import * as tutorials from '../../services/tutorials';

import { ITutorialWindowProps } from '../../windows/WindowType';
import { Tutorial } from './Tutorial';

interface ITutorialContainerState {
  activeChapterIndex: number;
  tutorial?: tutorials.ITutorial;
  context: { [key: string]: string };
}

class TutorialContainer extends React.Component<
  ITutorialWindowProps,
  ITutorialContainerState
> {
  constructor() {
    super();
    this.state = {
      activeChapterIndex: 0,
      context: {},
    };
  }

  public componentDidMount() {
    const serverHostname = this.getServerHostname(this.props.context.serverUrl);
    const tutorial = tutorials.getTutorial(this.props.id);
    if (tutorial) {
      this.setState({
        tutorial,
        // Derive some context parameters
        context: {
          serverHostname,
          ...this.props.context,
        },
      });
    }
  }

  public render() {
    return (
      <Tutorial
        activeChapterIndex={this.state.activeChapterIndex}
        context={this.state.context}
        onChapterSelect={this.onChapterSelect}
        onClose={this.onClose}
        onNextChapter={this.onNextChapter}
        onPreviousChapter={this.onPreviousChapter}
        tutorial={this.state.tutorial}
      />
    );
  }

  protected onChapterSelect = (index: number) => {
    this.setState({
      activeChapterIndex: index,
    });
  };

  protected onClose = () => {
    window.close();
  };

  protected onNextChapter = () => {
    this.setState({
      activeChapterIndex: this.state.activeChapterIndex + 1,
    });
  };

  protected onPreviousChapter = () => {
    this.setState({
      activeChapterIndex: Math.max(this.state.activeChapterIndex - 1, 0),
    });
  };

  protected getServerHostname(serverUrl: string) {
    const url = new URL(serverUrl);
    return url.hostname;
  }
}

export { TutorialContainer as Tutorial };
