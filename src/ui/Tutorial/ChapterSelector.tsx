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
