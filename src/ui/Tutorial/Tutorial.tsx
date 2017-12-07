import * as React from 'react';

import { ITutorial } from '../../services/tutorials';

import { Chapter } from './Chapter';
import { ChapterSelector } from './ChapterSelector';

import './Tutorial.scss';

interface ITutorialProps {
  activeChapterIndex: number;
  onChapterSelect: (index: number) => void;
  tutorial?: ITutorial;
}

export const Tutorial = ({
  activeChapterIndex,
  onChapterSelect,
  tutorial,
}: ITutorialProps) => {
  if (tutorial) {
    const activeChapter = tutorial.chapters[activeChapterIndex];
    return (
      <section className="Tutorial">
        {activeChapter ? (
          <Chapter chapter={activeChapter} />
        ) : (
          <p>Missing chapter #{activeChapterIndex + 1}</p>
        )}
        <ChapterSelector
          activeChapterIndex={activeChapterIndex}
          chapters={tutorial.chapters}
          onChapterSelect={onChapterSelect}
        />
      </section>
    );
  } else {
    return null;
  }
};
