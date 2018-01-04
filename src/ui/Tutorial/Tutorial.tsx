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
