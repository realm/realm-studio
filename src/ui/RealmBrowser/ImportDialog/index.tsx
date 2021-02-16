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

import React from 'react';

import { ImportableFile, ImportFormat } from "../../../services/data-importer";

import { ImportDialog } from './ImportDialog';

export interface IImportDialogContainerProps {
  onHide: () => void;
  onImport: (format: ImportFormat, files: ImportableFile[]) => void;
  visible: boolean;
  filePaths: string[];
  classNames: string[];
}

export interface IImportDialogContainerState {
  pathClassMapping: { [filePath: string]: string };
}

class ImportDialogContainer extends React.Component<
  IImportDialogContainerProps,
  IImportDialogContainerState
> {
  public state: IImportDialogContainerState = {
    pathClassMapping: {},
  };

  public render() {
    return (
      <ImportDialog
        onCancel={this.props.onHide}
        onClassChange={this.onClassChange}
        onSubmit={this.onSubmit}
        pathClassMapping={this.state.pathClassMapping}
        filePaths={this.props.filePaths}
        classNames={this.props.classNames}
        visible={this.props.visible}
      />
    );
  }

  protected onClassChange = (filePath: string, className: string) => {
    this.setState({
      pathClassMapping: {
        ...this.state.pathClassMapping,
        [filePath]: className,
      },
    });
  };

  protected onSubmit = (e: React.FormEvent<any>) => {
    e.preventDefault();
    this.props.onHide();
    const importableFiles: ImportableFile[] = Object.entries(this.state.pathClassMapping).map(([filePath, className]) => ({ path: filePath, className}));
    this.props.onImport(ImportFormat.CSV, importableFiles);
  };
}

export { ImportDialogContainer as ImportDialog };
