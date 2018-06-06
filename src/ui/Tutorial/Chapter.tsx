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
