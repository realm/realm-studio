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

import { ITutorial } from '../../services/tutorials';

import { Chapter } from './Chapter';
import { ChapterSelector } from './ChapterSelector';

import './Tutorial.scss';

interface ITutorialProps {
  activeChapterIndex: number;
  context: { [key: string]: string };
  onChapterSelect: (index: number) => void;
  onClose: () => void;
  onNextChapter: () => void;
  onPreviousChapter: () => void;
  tutorial?: ITutorial;
}

export const Tutorial = ({
  activeChapterIndex,
  context,
  onChapterSelect,
  onClose,
  onNextChapter,
  onPreviousChapter,
  tutorial,
}: ITutorialProps) => {
  if (tutorial) {
    const activeChapter = tutorial.chapters[activeChapterIndex];
    return (
      <section className="Tutorial">
        {activeChapter ? (
          <Chapter chapter={activeChapter} context={context} />
        ) : (
          <p>Missing chapter #{activeChapterIndex + 1}</p>
        )}
        <ChapterSelector
          activeChapterIndex={activeChapterIndex}
          chapters={tutorial.chapters}
          onChapterSelect={onChapterSelect}
          onClose={onClose}
          onNextChapter={onNextChapter}
          onPreviousChapter={onPreviousChapter}
        />
      </section>
    );
  } else {
    return null;
  }
};
