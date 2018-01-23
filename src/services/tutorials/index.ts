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
