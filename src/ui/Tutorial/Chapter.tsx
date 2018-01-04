import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';

import { ITutorialChapter } from '../../services/tutorials';

interface IChapterProps {
  chapter: ITutorialChapter;
  context: { [key: string]: string };
}

const replaceContextValues = (
  markdown: string,
  context: { [key: string]: string },
) => {
  return Object.keys(context).reduce((m, key) => {
    return m.replace(`$\{${key}\}`, context[key]);
  }, markdown);
};

export const Chapter = ({ chapter, context }: IChapterProps) => {
  const markdown = replaceContextValues(chapter.markdown, context);
  return <ReactMarkdown className="Tutorial__Chapter" source={markdown} />;
};
