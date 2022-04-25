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
import { act } from 'react-dom/test-utils';
import { waitFor } from '@testing-library/react';
import { ModelManager, PathUtils } from '@adobe/aem-spa-page-model-manager';
import { MappedComponentProperties } from '../src/core/ComponentMapping';
import { EditableComponent } from '../src/core/EditableComponent';
import { Properties, ClassNames, Events } from '../src/constants';

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
    '[' + Properties.DATA_CQ_RESOURCE_TYPE_ATTR + '="' + COMPONENT_RESOURCE_TYPE + '"]';
  const INNER_COMPONENT_ID = 'innerContent';
  const TEST_COMPONENT_MODEL = { ':type': 'test/components/componentchild' };

  const CQ_PROPS = {
    cqType: COMPONENT_RESOURCE_TYPE,
    cqPath: COMPONENT_PATH,
    appliedCssClassNames: CHILD_COMPONENT_APPLIED_STYLE_CLASS_NAME,
    containerProps: {
      className: GRID_CLASS_NAME,
    },
  };

  let rootNode: HTMLElement;
  let addListenerSpy: jest.SpyInstance;
  let getDataSpy: jest.SpyInstance;

  interface ChildComponentProps extends MappedComponentProperties {
    id?: string;
  }

  class ChildComponent extends Component<ChildComponentProps> {
    render() {
      const editorClassNames = this.props.isInEditor ? IN_EDITOR_CLASS_NAME : '';

      return <div id={INNER_COMPONENT_ID} className={CHILD_COMPONENT_CLASS_NAME + ' ' + editorClassNames} />;
    }
  }

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    rootNode = document.createElement('div');
    rootNode.className = ROOT_CLASS_NAME;
    getDataSpy = jest.spyOn(ModelManager, 'getData').mockResolvedValue({});
    addListenerSpy = jest.spyOn(ModelManager, 'addListener').mockImplementation();
    document.body.appendChild(rootNode);
  });

  afterEach(() => {
    if (rootNode) {
      document.body.appendChild(rootNode);
      rootNode = undefined;
    }
    getDataSpy.mockReset();
    addListenerSpy.mockReset();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  type Props = {
    cqType: string;
    cqPath: string;
    appliedCssClassNames?: string;
    containerProps: {
      className?: string;
    };
  };

  const createEditableComponent = (config, isInEditor = true, props: Props = CQ_PROPS) => (
    <EditableComponent isInEditor={isInEditor} config={config} {...props}>
      <ChildComponent {...props} />
    </EditableComponent>
  );

  describe('Component emptiness ->', () => {
    it('should declare the component to be empty', () => {
      const EDIT_CONFIG = {
        isEmpty: function () {
          return true;
        },
        emptyLabel: EMPTY_LABEL,
      };
      act(() => {
        ReactDOM.render(createEditableComponent(EDIT_CONFIG), rootNode);
        jest.runAllTimers();
      });

      const node = rootNode.querySelector(
        DATA_PATH_ATTRIBUTE_SELECTOR +
          ' .' +
          CHILD_COMPONENT_CLASS_NAME +
          ' + .' +
          ClassNames.DEFAULT_PLACEHOLDER +
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
      act(() => {
        ReactDOM.render(createEditableComponent(EDIT_CONFIG), rootNode);
      });

      let node = rootNode.querySelector(
        DATA_PATH_ATTRIBUTE_SELECTOR + ' .' + ClassNames.DEFAULT_PLACEHOLDER + EMPTY_TEXT_SELECTOR,
      );
      expect(node).toBeNull();
      node = rootNode.querySelector(
        DATA_PATH_ATTRIBUTE_SELECTOR + ' .' + CHILD_COMPONENT_CLASS_NAME + ' + .' + ClassNames.DEFAULT_PLACEHOLDER,
      );
      expect(node).not.toBeNull();
    });

    it('should declare the component as not being in the editor', () => {
      const EDIT_CONFIG = {
        isEmpty: function () {
          return true;
        },
      };

      act(() => {
        ReactDOM.render(createEditableComponent(EDIT_CONFIG, false), rootNode);
      });

      let node = rootNode.querySelector('.' + ClassNames.DEFAULT_PLACEHOLDER + EMPTY_TEXT_SELECTOR);
      expect(node).toBeNull();
      node = rootNode.querySelector(
        DATA_PATH_ATTRIBUTE_SELECTOR + ' .' + CHILD_COMPONENT_CLASS_NAME + ' + .' + ClassNames.DEFAULT_PLACEHOLDER,
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

      act(() => {
        ReactDOM.render(createEditableComponent(EDIT_CONFIG), rootNode);
      });

      let node = rootNode.querySelector('.' + CHILD_COMPONENT_CLASS_NAME + ' + .' + ClassNames.DEFAULT_PLACEHOLDER);
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
      act(() => {
        ReactDOM.render(createEditableComponent(EDIT_CONFIG), rootNode);
      });
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
      act(() => {
        ReactDOM.render(createEditableComponent(EDIT_CONFIG), rootNode);
      });
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
      act(() => {
        ReactDOM.render(createEditableComponent(EDIT_CONFIG), rootNode);
      });
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
      const { appliedCssClassNames, ...otherCQProps } = CQ_PROPS;
      act(() => {
        ReactDOM.render(createEditableComponent(EDIT_CONFIG, true, otherCQProps), rootNode);
      });
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
      act(() => {
        ReactDOM.render(createEditableComponent(EDIT_CONFIG), rootNode);
      });
      const node = rootNode.querySelector('.' + GRID_CLASS_NAME);
      expect(node).not.toBeNull();
    });
  });

  describe('Model events ->', () => {
    it('should initialize properly without parameter', () => {
      act(() => {
        ReactDOM.render(
          <EditableComponent cqPath="">
            <ChildComponent />
          </EditableComponent>,
          rootNode,
        );
      });
      expect(addListenerSpy).toHaveBeenCalledWith('', expect.any(Function));
      const childNode = rootNode.querySelector('#' + INNER_COMPONENT_ID);
      expect(childNode).toBeDefined();
    });

    it('should render components with a cqpath parameter', () => {
      act(() => {
        ReactDOM.render(
          <EditableComponent cqPath={COMPONENT_PATH}>
            <ChildComponent />
          </EditableComponent>,
          rootNode,
        );
      });
      expect(addListenerSpy).toHaveBeenCalledWith(COMPONENT_PATH, expect.any(Function));
      expect(getDataSpy).toHaveBeenCalledWith({ path: COMPONENT_PATH, forceReload: false });
      const childNode = rootNode.querySelector('#' + INNER_COMPONENT_ID);
      expect(childNode).toBeDefined();
    });

    it('should render components with a pagepath parameter', () => {
      act(() => {
        ReactDOM.render(
          <EditableComponent pagePath={COMPONENT_PATH}>
            <ChildComponent />
          </EditableComponent>,
          rootNode,
        );
      });
      expect(addListenerSpy).toHaveBeenCalledWith(COMPONENT_PATH, expect.any(Function));
      expect(getDataSpy).toHaveBeenCalledWith({ path: COMPONENT_PATH, forceReload: false });
      const childNode = rootNode.querySelector('#' + INNER_COMPONENT_ID);
      expect(childNode).toBeDefined();
    });

    it('should render components when pagepath and path to item is provided', () => {
      const PAGE_PATH = '/page/subpage';
      const ITEM_PATH = 'root/paragraph';
      const PATH = `${PAGE_PATH}/jcr:content/${ITEM_PATH}`;

      act(() => {
        ReactDOM.render(
          <EditableComponent pagePath={PAGE_PATH} itemPath={ITEM_PATH}>
            <ChildComponent />
          </EditableComponent>,
          rootNode,
        );
      });

      expect(addListenerSpy).toHaveBeenCalledWith(PATH, expect.any(Function));
      expect(getDataSpy).toHaveBeenCalledWith({ path: PATH, forceReload: false });

      const childNode = rootNode.querySelector('#' + INNER_COMPONENT_ID);
      expect(childNode).toBeDefined();
    });

    it('should fire event to reload editables when in editor for remote app', async () => {
      const dispatchEventSpy: jest.SpyInstance = jest
        .spyOn(PathUtils, 'dispatchGlobalCustomEvent')
        .mockImplementation();
      getDataSpy = jest.spyOn(ModelManager, 'getData').mockResolvedValue(TEST_COMPONENT_MODEL);
      act(() => {
        ReactDOM.render(
          <EditableComponent pagePath={COMPONENT_PATH} isInEditor={true}>
            <ChildComponent />
          </EditableComponent>,
          rootNode,
        );
      });

      expect(getDataSpy).toHaveBeenCalledWith({ path: COMPONENT_PATH, forceReload: false });
      const childNode = rootNode.querySelector('#' + INNER_COMPONENT_ID);
      expect(childNode).toBeDefined();
      await waitFor(() => expect(dispatchEventSpy).toHaveBeenCalledWith(Events.ASYNC_CONTENT_LOADED_EVENT, {}));
      dispatchEventSpy.mockReset();
    });
    it('should log error when there is no data', async () => {
      const error = new Error('404 - Not found');
      getDataSpy.mockRejectedValue(error);
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      act(() => {
        ReactDOM.render(
          <EditableComponent cqPath={COMPONENT_PATH}>
            <ChildComponent />
          </EditableComponent>,
          rootNode,
        );
      });
      await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith(error));
      consoleSpy.mockRestore();
    });
    it('should remove listeners on unmount', () => {
      const removeListenerSpy: jest.SpyInstance = jest.spyOn(ModelManager, 'removeListener').mockImplementation();

      act(() => {
        ReactDOM.render(
          <EditableComponent cqPath={COMPONENT_PATH}>
            <ChildComponent />
          </EditableComponent>,
          rootNode,
        );
      });
      ReactDOM.unmountComponentAtNode(rootNode);
      expect(removeListenerSpy).toHaveBeenCalledWith(COMPONENT_PATH, expect.any(Function));
    });
  });
});
