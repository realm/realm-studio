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

import * as electron from 'electron';
import * as fs from 'fs-extra';
import * as path from 'path';

export interface ITutorialConfig {
  title: string;
  chapters: ITutorialChapterConfig[];
}

export interface ITutorialChapterConfig {
  markdownPath: string;
}

export interface ITutorial {
  title: string;
  chapters: ITutorialChapter[];
}

export interface ITutorialChapter extends ITutorialChapterConfig {
  markdown: string;
}

export const getPath = (id: string, filePath: string) => {
  // We need to resolve relative to the app.getAppPath() and the CWD gets changed at runtime
  const app = electron.remote ? electron.remote.app : electron.app;
  const cwd = app.getAppPath();
  return path.resolve(cwd, `tutorials/${id}/${filePath}`);
};

export const getConfig = (id: string): ITutorialConfig | null => {
  const configPath = getPath(id, 'config.json');
  try {
    return fs.readJsonSync(configPath);
  } catch (err) {
    return null;
  }
};

export const getTutorial = (id: string): ITutorial | null => {
  const config = getConfig(id);
  if (config) {
    return {
      ...config,
      chapters: config.chapters.map(chapter => {
        const absoluteMarkdownPath = getPath(id, chapter.markdownPath);
        return {
          ...chapter,
          markdown: fs.readFileSync(absoluteMarkdownPath, 'utf8'),
        };
      }),
    };
  } else {
    return null;
  }
};
