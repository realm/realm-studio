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
import { Button } from 'reactstrap';

import { ITutorialChapter } from '../../services/tutorials';

import { ChapterButton } from './ChapterButton';

interface IChapterSelectorProps {
  activeChapterIndex: number;
  chapters: ITutorialChapter[];
  onChapterSelect: (index: number) => void;
  onClose: () => void;
  onNextChapter: () => void;
  onPreviousChapter: () => void;
}

export const ChapterSelector = ({
  activeChapterIndex,
  chapters,
  onChapterSelect,
  onClose,
  onNextChapter,
  onPreviousChapter,
}: IChapterSelectorProps) => (
  <section className="Tutorial__ChapterSelector">
    <div className="Tutorial__Previous">
      <Button onClick={onPreviousChapter} disabled={activeChapterIndex <= 0}>
        <i className="fa fa-chevron-left" /> Previous
      </Button>
    </div>
    <div className="Tutorial__ChapterButtons">
      {chapters.map((chapter, index) => (
        <ChapterButton
          chapter={chapter}
          index={index}
          isCompleted={index < activeChapterIndex}
          isSelected={index === activeChapterIndex}
          key={index}
          onChapterSelect={onChapterSelect}
        />
      ))}
    </div>
    <div className="Tutorial__Next">
      {activeChapterIndex < chapters.length - 1 ? (
        <Button onClick={onNextChapter}>
          Next <i className="fa fa-chevron-right" />
        </Button>
      ) : (
        <Button onClick={onClose}>
          Close <i className="fa fa-close" />
        </Button>
      )}
    </div>
  </section>
);
