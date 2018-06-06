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

import * as classNames from 'classnames';
import * as React from 'react';

import { ITutorialChapter } from '../../services/tutorials';

interface IChapterButtonProps {
  chapter: ITutorialChapter;
  index: number;
  isCompleted: boolean;
  isSelected: boolean;
  onChapterSelect: (index: number) => void;
}

export const ChapterButton = ({
  chapter,
  index,
  isCompleted,
  isSelected,
  onChapterSelect,
}: IChapterButtonProps) => (
  <div
    className={classNames('Tutorial__ChapterButton', {
      [`Tutorial__ChapterButton--selected-${index}`]: isSelected,
      [`Tutorial__ChapterButton--completed-${index}`]: isCompleted,
    })}
    onClick={() => onChapterSelect(index)}
  >
    {index + 1}
  </div>
);
