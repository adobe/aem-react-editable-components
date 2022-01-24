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
import { withEditable } from '../src/components/EditableComponent';
import { Constants } from '../src/Constants';
import Utils from '../src/Utils';

describe('EditableComponent ->', () => {
  const ROOT_CLASS_NAME = 'root-class';
  const COMPONENT_RESOURCE_TYPE = '/component/resource/type';
  const COMPONENT_PATH = '/path/to/component';
  const CHILD_COMPONENT_CLASS_NAME = 'child-class';
  const CHILD_COMPONENT_APPLIED_STYLE_CLASS_NAME = 'my_custom_style';
  const IN_EDITOR_CLASS_NAME = 'in-editor-class';
  const GRID_CLASS_NAME = 'aem-grid-column-x';
  const EMPTY_LABEL = 'Empty Label';
  const EMPTY_TEXT_SELECTOR = '[data-emptytext="' + EMPTY_LABEL + '"]';
  const DATA_PATH_ATTRIBUTE_SELECTOR = '[data-cq-data-path="' + COMPONENT_PATH + '"]';
  const DATA_RESOURCE_TYPE_SELECTOR =
    '[' + Constants.DATA_CQ_RESOURCE_TYPE_ATTR + '="' + COMPONENT_RESOURCE_TYPE + '"]';

  const CQ_PROPS = {
    cqType: COMPONENT_RESOURCE_TYPE,
    cqPath: COMPONENT_PATH,
    appliedCssClassNames: CHILD_COMPONENT_APPLIED_STYLE_CLASS_NAME,
    containerProps: {
      className: GRID_CLASS_NAME,
    },
  };

  let rootNode: any;
  let sandbox: jest.SpyInstance;
  let isInEditor = false;

  interface ChildComponentProps extends MappedComponentProperties {
    id?: string;
  }

  class ChildComponent extends Component<ChildComponentProps> {
    render() {
      const editorClassNames = this.props.isInEditor ? IN_EDITOR_CLASS_NAME : '';

      return <div id={this.props.id} className={CHILD_COMPONENT_CLASS_NAME + ' ' + editorClassNames} />;
    }
  }

  beforeEach(() => {
    sandbox = jest.spyOn(Utils, 'isInEditor').mockImplementation(() => isInEditor);
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
      const element: JSX.Element = <EditableComponent isInEditor={true} {...CQ_PROPS} />;

      ReactDOM.render(element, rootNode);

      const node = rootNode.querySelector(
        DATA_PATH_ATTRIBUTE_SELECTOR +
          ' .' +
          CHILD_COMPONENT_CLASS_NAME +
          ' + .' +
          Constants._PLACEHOLDER_CLASS_NAMES +
          EMPTY_TEXT_SELECTOR,
      );

      expect(node).not.toBeNull();
    });

    it('should declare the component to be empty without providing a label', () => {
      const EDIT_CONFIG = {
        isEmpty: function () {
          return true;
        },
      };

      isInEditor = true;

      const EditableComponent: any = withEditable(ChildComponent, EDIT_CONFIG);

      ReactDOM.render(<EditableComponent isInEditor={true} {...CQ_PROPS} />, rootNode);

      let node = rootNode.querySelector(
        DATA_PATH_ATTRIBUTE_SELECTOR + ' .' + Constants._PLACEHOLDER_CLASS_NAMES + EMPTY_TEXT_SELECTOR,
      );

      expect(node).toBeNull();

      node = rootNode.querySelector(
        DATA_PATH_ATTRIBUTE_SELECTOR + ' .' + CHILD_COMPONENT_CLASS_NAME + ' + .' + Constants._PLACEHOLDER_CLASS_NAMES,
      );

      expect(node).not.toBeNull();
    });

    it('should declare the component as not being in the editor', () => {
      const EDIT_CONFIG = {
        isEmpty: function () {
          return true;
        },
      };

      isInEditor = true;

      const EditableComponent: any = withEditable(ChildComponent, EDIT_CONFIG);

      ReactDOM.render(<EditableComponent isInEditor={false} {...CQ_PROPS} />, rootNode);

      let node = rootNode.querySelector('.' + Constants._PLACEHOLDER_CLASS_NAMES + EMPTY_TEXT_SELECTOR);

      expect(node).toBeNull();

      node = rootNode.querySelector(
        DATA_PATH_ATTRIBUTE_SELECTOR + ' .' + CHILD_COMPONENT_CLASS_NAME + ' + .' + Constants._PLACEHOLDER_CLASS_NAMES,
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

      ReactDOM.render(<EditableComponent isInEditor={true} {...CQ_PROPS} />, rootNode);

      let node = rootNode.querySelector('.' + CHILD_COMPONENT_CLASS_NAME + ' + .' + Constants._PLACEHOLDER_CLASS_NAMES);

      expect(node).toBeNull();

      node = rootNode.querySelector(DATA_PATH_ATTRIBUTE_SELECTOR + ' .' + CHILD_COMPONENT_CLASS_NAME);

      expect(node).not.toBeNull();
    });
  });

  describe('resouceType attribute ->', () => {
    it('should have the data-cq-resource-type attribute set when passing this via the Editconfig', () => {
      const EDIT_CONFIG = {
        isEmpty: function () {
          return false;
        },
        emptyLabel: EMPTY_LABEL,
        resourceType: COMPONENT_RESOURCE_TYPE,
      };

      const EditableComponent: any = withEditable(ChildComponent, EDIT_CONFIG);

      ReactDOM.render(<EditableComponent isInEditor={true} {...CQ_PROPS} />, rootNode);

      const node = rootNode.querySelector(DATA_RESOURCE_TYPE_SELECTOR);

      expect(node).not.toBeNull();
    });

    it('should NOT have the data-cq-resource-type attribute set when NOT passing it via the Editconfig', () => {
      const EDIT_CONFIG = {
        isEmpty: function () {
          return false;
        },
        emptyLabel: EMPTY_LABEL,
      };

      const EditableComponent: any = withEditable(ChildComponent, EDIT_CONFIG);

      ReactDOM.render(<EditableComponent isInEditor={true} {...CQ_PROPS} />, rootNode);

      const node = rootNode.querySelector(DATA_RESOURCE_TYPE_SELECTOR);

      expect(node).toBeNull();
    });
  });

  describe('resouceType attribute (className) ->', () => {
    it('should have the className attribute containing appliedCssClasses value appended/set to pre-existing className if any set', () => {
      const EDIT_CONFIG = {
        isEmpty: function () {
          return false;
        },
        emptyLabel: EMPTY_LABEL,
        resourceType: COMPONENT_RESOURCE_TYPE,
      };

      const EditableComponent: any = withEditable(ChildComponent, EDIT_CONFIG);

      ReactDOM.render(<EditableComponent isInEditor={true} {...CQ_PROPS} />, rootNode);

      const node = rootNode.querySelector(DATA_PATH_ATTRIBUTE_SELECTOR + '.' + CQ_PROPS.appliedCssClassNames);

      expect(node).not.toBeNull();
    });

    it('should not have any custom CSS classes if appliedCssClasses is empty or not set', () => {
      const EDIT_CONFIG = {
        isEmpty: function () {
          return false;
        },
        emptyLabel: EMPTY_LABEL,
        resourceType: COMPONENT_RESOURCE_TYPE,
      };

      const EditableComponent: any = withEditable(ChildComponent, EDIT_CONFIG);

      const { appliedCssClassNames, ...otherCQProps } = CQ_PROPS;

      ReactDOM.render(<EditableComponent isInEditor={true} {...otherCQProps} />, rootNode);

      const node = rootNode.querySelector(DATA_PATH_ATTRIBUTE_SELECTOR + '.' + appliedCssClassNames);

      expect(node).toBeNull();
    });

    it('if aem grid column styles set, appliedCssClassNames should not override the grid styles', () => {
      const EDIT_CONFIG = {
        isEmpty: function () {
          return false;
        },
        emptyLabel: EMPTY_LABEL,
        resourceType: COMPONENT_RESOURCE_TYPE,
      };

      const EditableComponent: any = withEditable(ChildComponent, EDIT_CONFIG);

      ReactDOM.render(<EditableComponent isInEditor={true} {...CQ_PROPS} />, rootNode);

      const node = rootNode.querySelector('.' + GRID_CLASS_NAME);

      expect(node).not.toBeNull();
    });
  });

  describe('component decoration ->', () => {
    it('if aemNoDecoration is set to true, there should not be a component div wrapper', () => {
      const EDIT_CONFIG = {
        isEmpty: function () {
          return false;
        },
        emptyLabel: EMPTY_LABEL,
        resourceType: COMPONENT_RESOURCE_TYPE,
      };

      const EditableComponent: any = withEditable(ChildComponent, EDIT_CONFIG);

      ReactDOM.render(<EditableComponent isInEditor={false} aemNoDecoration={true} {...CQ_PROPS} />, rootNode);

      const node = rootNode.querySelector('.' + CQ_PROPS.appliedCssClassNames);

      expect(node).toBeNull();
    });
  });
});
