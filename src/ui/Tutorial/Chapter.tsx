import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';

import { ITutorialChapter } from '../../services/tutorials';

interface IChapterProps {
  chapter: ITutorialChapter;
}

export const Chapter = ({ chapter }: IChapterProps) => (
  <ReactMarkdown className="Tutorial__Chapter" source={chapter.markdown} />
);
