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

import * as tutorials from '../../services/tutorials';

import { ITutorialWindowProps } from '../../windows/WindowProps';
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
  public state: ITutorialContainerState = {
    activeChapterIndex: 0,
    context: {},
  };

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
