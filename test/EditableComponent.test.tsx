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

import React from 'react';
import { act } from 'react-dom/test-utils';
import { waitFor, render, screen } from '@testing-library/react';
import { ModelManager, PathUtils } from '@adobe/aem-spa-page-model-manager';
import { EditableComponent } from '../src/core/EditableComponent';
import { ClassNames, Events } from '../src/constants';

describe('EditableComponent ->', () => {
  const COMPONENT_RESOURCE_TYPE = '/component/resource/type';
  const COMPONENT_PATH = '/path/to/component';
  const CHILD_COMPONENT_CLASS_NAME = 'child-class';
  const CHILD_COMPONENT_APPLIED_STYLE_CLASS_NAME = 'my_custom_style';
  const IN_EDITOR_CLASS_NAME = 'in-editor-class';
  const GRID_CLASS_NAME = 'aem-grid-column-x';
  const EMPTY_LABEL = 'Empty Label';
  const EMPTY_TEXT_SELECTOR = '[data-emptytext="' + EMPTY_LABEL + '"]';
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

  let addListenerSpy: jest.SpyInstance;
  let removeListenerSpy: jest.SpyInstance;
  let getDataSpy: jest.SpyInstance;

  const ChildComponent = ({ className = '' }) => {
    return <div id={INNER_COMPONENT_ID} data-testid="childComponent" className={className} />;
  };

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    getDataSpy = jest.spyOn(ModelManager, 'getData').mockResolvedValue({});
    addListenerSpy = jest.spyOn(ModelManager, 'addListener').mockImplementation();
    removeListenerSpy = jest.spyOn(ModelManager, 'removeListener').mockImplementation();
  });

  afterEach(() => {
    getDataSpy.mockReset();
    addListenerSpy.mockReset();
    removeListenerSpy.mockReset();
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

  const createEditableComponent = (config, isInEditor = true, props: Props = CQ_PROPS) => {
    const editorClassNames = isInEditor ? IN_EDITOR_CLASS_NAME : '';
    return (
      <EditableComponent isInEditor={isInEditor} config={config} {...props}>
        <ChildComponent className={CHILD_COMPONENT_CLASS_NAME + ' ' + editorClassNames} />
      </EditableComponent>
    );
  };

  describe('Component emptiness ->', () => {
    it('should declare the component to be empty', () => {
      const EDIT_CONFIG = {
        isEmpty: function () {
          return true;
        },
        emptyLabel: EMPTY_LABEL,
      };
      act(() => {
        render(createEditableComponent(EDIT_CONFIG));
      });

      const node = screen.getByTestId('childComponent').parentElement;
      expect(node.querySelector('.' + ClassNames.DEFAULT_PLACEHOLDER + EMPTY_TEXT_SELECTOR)).toBeTruthy();
      expect(node).not.toBeNull();
    });

    it('should declare the component to be empty without providing a label', () => {
      const EDIT_CONFIG = {
        isEmpty: function () {
          return true;
        },
      };
      act(() => {
        render(createEditableComponent(EDIT_CONFIG));
      });

      const node = screen.getByTestId('childComponent').parentElement;
      expect(node.querySelector(EMPTY_TEXT_SELECTOR)).toBeFalsy();
      expect(node.querySelector('.' + ClassNames.DEFAULT_PLACEHOLDER)).toBeTruthy();
    });

    it('should declare the component as not being in the editor', () => {
      const EDIT_CONFIG = { isEmpty: () => true };
      act(() => {
        render(createEditableComponent(EDIT_CONFIG, false));
      });
      const node = screen.getByTestId('childComponent').parentElement;
      expect(node.querySelector(EMPTY_TEXT_SELECTOR)).toBeFalsy();
      expect(node.querySelector('.' + ClassNames.DEFAULT_PLACEHOLDER)).toBeFalsy();
    });

    it('should declare the component not to be empty', () => {
      const EDIT_CONFIG = {
        isEmpty: function () {
          return false;
        },
        emptyLabel: EMPTY_LABEL,
      };
      act(() => {
        render(createEditableComponent(EDIT_CONFIG));
      });
      const node = screen.getByTestId('childComponent');
      expect(node).toBeDefined();
      expect(node.parentElement.querySelector('.' + ClassNames.DEFAULT_PLACEHOLDER)).toBeFalsy();
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
        render(createEditableComponent(EDIT_CONFIG));
      });
      const node = screen.getByTestId('childComponent').parentElement;
      expect(node.dataset.cqResourceType).toEqual(COMPONENT_RESOURCE_TYPE);
    });

    it('should NOT have the data-cq-resource-type attribute set when NOT passing it via the Editconfig', () => {
      const EDIT_CONFIG = {
        isEmpty: function () {
          return false;
        },
        emptyLabel: EMPTY_LABEL,
      };
      act(() => {
        render(createEditableComponent(EDIT_CONFIG));
      });
      const node = screen.getByTestId('childComponent').parentElement;
      expect(node.dataset.cqResourceType).toEqual('');
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
        render(createEditableComponent(EDIT_CONFIG));
      });
      const node = screen.getByTestId('childComponent').parentElement;
      expect(node.classList.contains(CQ_PROPS.appliedCssClassNames)).toBeTruthy();
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
        render(createEditableComponent(EDIT_CONFIG, true, otherCQProps));
      });
      const node = screen.getByTestId('childComponent').parentElement;
      expect(node.classList.contains(appliedCssClassNames)).toBeFalsy();
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
        render(createEditableComponent(EDIT_CONFIG));
      });
      const node = screen.getByTestId('childComponent').parentElement;
      expect(node.classList.contains(GRID_CLASS_NAME)).toBeTruthy();
    });
  });

  describe('Model events ->', () => {
    it('should initialize properly without parameter', () => {
      act(() => {
        render(
          <EditableComponent cqPath="">
            <ChildComponent />
          </EditableComponent>,
        );
      });
      expect(addListenerSpy).toHaveBeenCalledWith('', expect.any(Function));
      const node = screen.getByTestId('childComponent');
      expect(node).toBeDefined();
    });

    it('should render components with a cqpath parameter', () => {
      act(() => {
        render(
          <EditableComponent cqPath={COMPONENT_PATH}>
            <ChildComponent />
          </EditableComponent>,
        );
      });
      expect(addListenerSpy).toHaveBeenCalledWith(COMPONENT_PATH, expect.any(Function));
      expect(getDataSpy).toHaveBeenCalledWith({ path: COMPONENT_PATH, forceReload: false });
      const node = screen.getByTestId('childComponent');
      expect(node).toBeDefined();
    });

    it('should render components with a pagepath parameter', () => {
      act(() => {
        render(
          <EditableComponent pagePath={COMPONENT_PATH}>
            <ChildComponent />
          </EditableComponent>,
        );
      });
      expect(addListenerSpy).toHaveBeenCalledWith(COMPONENT_PATH, expect.any(Function));
      expect(getDataSpy).toHaveBeenCalledWith({ path: COMPONENT_PATH, forceReload: false });
      const node = screen.getByTestId('childComponent');
      expect(node).toBeDefined();
    });

    it('should render components when pagepath and path to item is provided', () => {
      const PAGE_PATH = '/page/subpage';
      const ITEM_PATH = 'root/paragraph';
      const PATH = `${PAGE_PATH}/jcr:content/${ITEM_PATH}`;

      act(() => {
        render(
          <EditableComponent pagePath={PAGE_PATH} itemPath={ITEM_PATH}>
            <ChildComponent />
          </EditableComponent>,
        );
      });

      expect(addListenerSpy).toHaveBeenCalledWith(PATH, expect.any(Function));
      expect(getDataSpy).toHaveBeenCalledWith({ path: PATH, forceReload: false });
      const node = screen.getByTestId('childComponent');
      expect(node).toBeDefined();
    });

    it('should fire event to reload editables when in editor for remote app', async () => {
      const dispatchEventSpy: jest.SpyInstance = jest
        .spyOn(PathUtils, 'dispatchGlobalCustomEvent')
        .mockImplementation();
      getDataSpy = jest.spyOn(ModelManager, 'getData').mockResolvedValue(TEST_COMPONENT_MODEL);
      act(() => {
        render(
          <EditableComponent pagePath={COMPONENT_PATH} isInEditor={true}>
            <ChildComponent />
          </EditableComponent>,
        );
      });

      expect(getDataSpy).toHaveBeenCalledWith({ path: COMPONENT_PATH, forceReload: false });
      const node = screen.getByTestId('childComponent');
      expect(node).toBeDefined();
      await waitFor(() => expect(dispatchEventSpy).toHaveBeenCalledWith(Events.ASYNC_CONTENT_LOADED_EVENT, {}));
      dispatchEventSpy.mockReset();
    });
    it('should log error when there is no data', async () => {
      const error = new Error('404 - Not found');
      getDataSpy = jest.spyOn(ModelManager, 'getData').mockImplementation(() => {
        throw error;
      });
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      act(() => {
        render(
          <EditableComponent cqPath={COMPONENT_PATH}>
            <ChildComponent />
          </EditableComponent>,
        );
      });
      await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith(error));
      consoleSpy.mockRestore();
    });
    it('should remove listeners on unmount', () => {
      act(() => {
        const { unmount } = render(
          <EditableComponent cqPath={COMPONENT_PATH}>
            <ChildComponent />
          </EditableComponent>,
        );
        unmount();
      });
      expect(removeListenerSpy).toHaveBeenCalledWith(COMPONENT_PATH, expect.any(Function));
    });
  });

  it('should render components even if the children are not valid React elements', () => {
    const isElementValidSpy = jest.spyOn(React, 'isValidElement').mockReturnValue(false);
    act(() => {
      render(
        <EditableComponent cqPath={COMPONENT_PATH}>
          <ChildComponent />
        </EditableComponent>,
      );
    });
    expect(addListenerSpy).toHaveBeenCalledWith(COMPONENT_PATH, expect.any(Function));
    expect(getDataSpy).toHaveBeenCalledWith({ path: COMPONENT_PATH, forceReload: false });
    const node = screen.getByTestId('childComponent');
    expect(node).toBeDefined();
    isElementValidSpy.mockReset();
  });
});
