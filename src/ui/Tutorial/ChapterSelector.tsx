import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';

import { ITutorialChapter } from '../../services/tutorials';

import { ChapterButton } from './ChapterButton';

interface IChapterSelectorProps {
  activeChapterIndex: number;
  chapters: ITutorialChapter[];
  onChapterSelect: (index: number) => void;
}

export const ChapterSelector = ({
  activeChapterIndex,
  chapters,
  onChapterSelect,
}: IChapterSelectorProps) => (
  <section className="Tutorial__ChapterSelector">
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
  </section>
);
