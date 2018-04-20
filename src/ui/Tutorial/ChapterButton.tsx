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
