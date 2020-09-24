/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import * as React from 'react';
import ReactDOM from 'react-dom';
import { MappedComponentProperties } from '../src/ComponentMapping';
import { EditorContext, withEditorContext } from '../src/EditorContext';

describe('EditorContext ->', () => {
  const ROOT_CLASS_NAME = 'root-class';
  const CHILD_COMPONENT_CLASS_NAME = 'child-class';
  const IN_EDITOR_CLASS_NAME = 'in-editor-class';

  let rootNode: any;
  let EditorContextComponent: any;

  interface ChildComponentProps extends MappedComponentProperties {
    id?: string;
  }

  class ChildComponent extends React.Component<ChildComponentProps> {
    render() {
      const editorClassNames = this.props.isInEditor
        ? IN_EDITOR_CLASS_NAME
        : '';

      return (
        <div
          id={this.props.id}
          className={CHILD_COMPONENT_CLASS_NAME + ' ' + editorClassNames}
        ></div>
      );
    }
  }

  beforeEach(() => {
    EditorContextComponent = withEditorContext(ChildComponent);
    rootNode = document.createElement('div');
    rootNode.className = ROOT_CLASS_NAME;
    document.body.appendChild(rootNode);
  });

  afterEach(() => {
    if (rootNode) {
      document.body.appendChild(rootNode);
      rootNode = undefined;
    }
  });

  describe('Provider/Consumer ->', () => {
    it('should propagate its value - true', () => {
      ReactDOM.render(
        <EditorContext.Provider value={true}>
          <EditorContextComponent></EditorContextComponent>
        </EditorContext.Provider>,
        rootNode
      );

      const childItem = rootNode.querySelector('.' + IN_EDITOR_CLASS_NAME);

      expect(childItem).toBeDefined();
    });

    it('should propagate its value - false', () => {
      ReactDOM.render(
        <EditorContext.Provider value={false}>
          <EditorContextComponent></EditorContextComponent>
        </EditorContext.Provider>,
        rootNode
      );

      const childItem = rootNode.querySelector('.' + IN_EDITOR_CLASS_NAME);

      expect(childItem).toBeNull();
    });
  });
});
