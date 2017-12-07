import * as React from 'react';

import * as tutorials from '../../services/tutorials';

import { ITutorialOptions } from '../../windows/WindowType';
import { Tutorial } from './Tutorial';

interface ITutorialContainerState {
  activeChapterIndex: number;
  tutorial?: tutorials.ITutorial;
}

class TutorialContainer extends React.Component<
  ITutorialOptions,
  ITutorialContainerState
> {
  constructor() {
    super();
    this.state = {
      activeChapterIndex: 0,
    };
  }

  public componentDidMount() {
    const tutorial = tutorials.getTutorial(this.props.id);
    if (tutorial) {
      this.setState({
        tutorial,
      });
    }
  }

  public render() {
    return (
      <Tutorial
        activeChapterIndex={this.state.activeChapterIndex}
        onChapterSelect={this.onChapterSelect}
        tutorial={this.state.tutorial}
      />
    );
  }

  protected onChapterSelect = (index: number) => {
    this.setState({
      activeChapterIndex: index,
    });
  };
}

export { TutorialContainer as Tutorial };
