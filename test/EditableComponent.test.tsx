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

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { MappedComponentProperties } from '../src/ComponentMapping';
import {
  PLACEHOLDER_CLASS_NAME,
  withEditable,
} from '../src/components/EditableComponent';
import Utils from '../src/Utils';

describe('EditableComponent ->', () => {
  const ROOT_CLASS_NAME = 'root-class';
  const COMPONENT_RESOURCE_TYPE = '/component/resource/type';
  const COMPONENT_PATH = '/path/to/component';
  const CHILD_COMPONENT_CLASS_NAME = 'child-class';
  const IN_EDITOR_CLASS_NAME = 'in-editor-class';
  const EMPTY_LABEL = 'Empty Label';
  const EMPTY_TEXT_SELECTOR = '[data-emptytext="' + EMPTY_LABEL + '"]';
  const DATA_PATH_ATTRIBUTE_SELECTOR =
    '[data-cq-data-path="' + COMPONENT_PATH + '"]';

  const CQ_PROPS = {
    cqType: COMPONENT_RESOURCE_TYPE,
    cqPath: COMPONENT_PATH,
  };

  let rootNode: any;
  let sandbox: jest.SpyInstance;
  let isInEditor = false;

  interface ChildComponentProps extends MappedComponentProperties {
    id?: string;
  }

  class ChildComponent extends Component<ChildComponentProps> {
    render() {
      const editorClassNames = this.props.isInEditor
        ? IN_EDITOR_CLASS_NAME
        : '';

      return (
        <div
          id={this.props.id}
          className={CHILD_COMPONENT_CLASS_NAME + ' ' + editorClassNames}
        />
      );
    }
  }

  beforeEach(() => {
    sandbox = jest
      .spyOn(Utils, 'isInEditor')
      .mockImplementation(() => isInEditor);
    rootNode = document.createElement('div');
    rootNode.className = ROOT_CLASS_NAME;
    document.body.appendChild(rootNode);
  });

  afterEach(() => {
    sandbox.mockRestore();

    if (rootNode) {
      document.body.appendChild(rootNode);
      rootNode = undefined;
    }
  });

  describe('Component emptiness ->', () => {
    it('should declare the component to be empty', () => {
      const EDIT_CONFIG = {
        isEmpty: function () {
          return true;
        },
        emptyLabel: EMPTY_LABEL,
      };

      const EditableComponent: any = withEditable(ChildComponent, EDIT_CONFIG);
      const element: JSX.Element = (
        <EditableComponent isInEditor={true} {...CQ_PROPS} />
      );

      ReactDOM.render(element, rootNode);

      const node = rootNode.querySelector(
        DATA_PATH_ATTRIBUTE_SELECTOR +
          ' .' +
          CHILD_COMPONENT_CLASS_NAME +
          ' + .' +
          PLACEHOLDER_CLASS_NAME +
          EMPTY_TEXT_SELECTOR
      );

      expect(node).toBeDefined();
    });

    it('should declare the component to be empty without providing a label', () => {
      const EDIT_CONFIG = {
        isEmpty: function () {
          return true;
        },
      };

      isInEditor = true;

      const EditableComponent: any = withEditable(ChildComponent, EDIT_CONFIG);

      ReactDOM.render(
        <EditableComponent isInEditor={true} {...CQ_PROPS} />,
        rootNode
      );

      let node = rootNode.querySelector(
        DATA_PATH_ATTRIBUTE_SELECTOR +
          ' .' +
          PLACEHOLDER_CLASS_NAME +
          EMPTY_TEXT_SELECTOR
      );

      expect(node).toBeNull();

      node = rootNode.querySelector(
        DATA_PATH_ATTRIBUTE_SELECTOR +
          ' .' +
          CHILD_COMPONENT_CLASS_NAME +
          ' + .' +
          PLACEHOLDER_CLASS_NAME
      );

      expect(node).toBeDefined();
    });

    it('should declare the component as not being in the editor', () => {
      const EDIT_CONFIG = {
        isEmpty: function () {
          return true;
        },
      };

      isInEditor = true;

      const EditableComponent: any = withEditable(ChildComponent, EDIT_CONFIG);

      ReactDOM.render(
        <EditableComponent isInEditor={false} {...CQ_PROPS} />,
        rootNode
      );

      let node = rootNode.querySelector(
        '.' + PLACEHOLDER_CLASS_NAME + EMPTY_TEXT_SELECTOR
      );

      expect(node).toBeNull();

      node = rootNode.querySelector(
        DATA_PATH_ATTRIBUTE_SELECTOR +
          ' .' +
          CHILD_COMPONENT_CLASS_NAME +
          ' + .' +
          PLACEHOLDER_CLASS_NAME
      );

      expect(node).toBeNull();
    });

    it('should declare the component not to be empty', () => {
      const EDIT_CONFIG = {
        isEmpty: function () {
          return false;
        },
        emptyLabel: EMPTY_LABEL,
      };

      const EditableComponent: any = withEditable(ChildComponent, EDIT_CONFIG);

      ReactDOM.render(
        <EditableComponent isInEditor={true} {...CQ_PROPS} />,
        rootNode
      );

      let node = rootNode.querySelector(
        '.' + CHILD_COMPONENT_CLASS_NAME + ' + .' + PLACEHOLDER_CLASS_NAME
      );

      expect(node).toBeNull();

      node = rootNode.querySelector(
        DATA_PATH_ATTRIBUTE_SELECTOR + ' .' + CHILD_COMPONENT_CLASS_NAME
      );

      expect(node).toBeDefined();
    });
  });
});
