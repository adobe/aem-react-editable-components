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
import { render, screen } from '@testing-library/react';
import { ComponentMapping } from '../../src/core/ComponentMapping';
import { Container } from '../../src/components/Container';

describe('Container ->', () => {
  const CONTAINER_PLACEHOLDER_SELECTOR = '.new.section';
  const CONTAINER_PLACEHOLDER_DATA_ATTRIBUTE_SELECTOR = '[data-cq-data-path="/container/*"]';
  const CONTAINER_PATH = '/container';
  const ITEM1_DATA_ATTRIBUTE_SELECTOR = '[data-cq-data-path="/container/component1"]';
  const ITEM2_DATA_ATTRIBUTE_SELECTOR = '[data-cq-data-path="/container/component2"]';
  const COMPONENT_TYPE1 = 'components/c1';
  const COMPONENT_TYPE2 = 'components/c2';
  const COMPONENT_1_CLASS_NAMES = 'component1-class';
  const COMPONENT_2_CLASS_NAMES = 'component2-class';

  const ITEMS = {
    component1: {
      ':type': COMPONENT_TYPE1,
      id: 'c1',
    },
    component2: {
      ':type': COMPONENT_TYPE2,
      id: 'c2',
    },
  };

  const ITEMS_NO_TYPE = {
    component1: {
      id: 'c1',
    },
    component2: {
      id: 'c2',
    },
  };

  const ITEM_CLASSES = {
    component1: COMPONENT_1_CLASS_NAMES,
    component2: COMPONENT_2_CLASS_NAMES,
  };

  const getItemClassNames = (itemKey: string) => {
    return ITEM_CLASSES[itemKey];
  };

  const ITEMS_ORDER = ['component1', 'component2'];

  const ComponentChild = ({ model, className, cqPath }) => {
    const { id = '' } = model || {};
    return <div id={id} className={className} data-cq-data-path={cqPath} />;
  };

  let rootNode: HTMLElement;
  let ComponentMappingSpy: jest.SpyInstance;

  beforeEach(() => {
    ComponentMappingSpy = jest.spyOn(ComponentMapping, 'get');
  });

  afterEach(() => {
    ComponentMappingSpy.mockRestore();

    if (rootNode) {
      document.body.appendChild(rootNode);
      rootNode = undefined;
    }
  });

  function generateContainerComponent({ isInEditor = true, cqPath = CONTAINER_PATH, ...rest }): JSX.Element {
    const props = {
      componentMapping: ComponentMapping,
      isInEditor,
      cqPath,
      ...rest,
    };
    return (
      <div data-testid="testcontainer">
        <Container {...props} />
      </div>
    );
  }

  describe('childComponents ->', () => {
    it('should not render components without type', () => {
      ComponentMappingSpy.mockReturnValue(ComponentChild);
      render(
        generateContainerComponent({
          isInEditor: false,
          cqPath: '',
          cqItems: ITEMS_NO_TYPE,
          cqItemsOrder: ITEMS_ORDER,
        }),
      );
      const node = screen.getByTestId('testcontainer');
      expect(node.querySelector('#c1')).toBeNull();
      expect(node.querySelector('#c2')).toBeNull();
    });
    it('should render available components if some are unmapped', () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      ComponentMappingSpy.mockReturnValueOnce(ComponentChild);
      render(
        generateContainerComponent({
          isInEditor: false,
          cqPath: '',
          cqItems: ITEMS,
          cqItemsOrder: ITEMS_ORDER,
        }),
      );
      const node = screen.getByTestId('testcontainer');
      expect(node.querySelector('#c1')).toBeTruthy();
      expect(node.querySelector('#c2')).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      expect(consoleSpy.mock.calls[0]).toContain('components/c2');
      consoleSpy.mockRestore();
    });
    it('should add the expected components', () => {
      ComponentMappingSpy.mockReturnValue(ComponentChild);
      render(generateContainerComponent({ isInEditor: false, cqPath: '', cqItems: ITEMS, cqItemsOrder: ITEMS_ORDER }));
      expect(ComponentMappingSpy).toHaveBeenCalledWith(COMPONENT_TYPE1);
      expect(ComponentMappingSpy).toHaveBeenCalledWith(COMPONENT_TYPE2);
      const node = screen.getByTestId('testcontainer');
      expect(node.querySelector('#c1')).toBeTruthy();
      expect(node.querySelector('#c2')).toBeTruthy();
    });

    it('should render components if container cqpath is undefined', () => {
      ComponentMappingSpy.mockReturnValue(ComponentChild);
      render(
        <div data-testid="testcontainer">
          <Container isInEditor={false} cqItems={ITEMS} cqItemsOrder={ITEMS_ORDER} />
        </div>,
      );
      const node = screen.getByTestId('testcontainer');
      expect(node.querySelector('#c1')).toBeTruthy();
      expect(node.querySelector('#c2')).toBeTruthy();
    });

    it('should add a placeholder with data attribute when in WCM edit mode', () => {
      render(generateContainerComponent({}));
      const node = screen.getByTestId('testcontainer');
      expect(
        node.querySelector(CONTAINER_PLACEHOLDER_DATA_ATTRIBUTE_SELECTOR + CONTAINER_PLACEHOLDER_SELECTOR),
      ).toBeTruthy();
    });

    it('should not add a placeholder when not in WCM edit mode', () => {
      render(generateContainerComponent({ isInEditor: false }));
      const node = screen.getByTestId('testcontainer');
      expect(node.querySelector(CONTAINER_PLACEHOLDER_SELECTOR)).toBeNull();
    });

    it('should add a data attribute on the children when in WCM edit mode', () => {
      ComponentMappingSpy.mockReturnValue(ComponentChild);
      render(
        generateContainerComponent({
          cqItems: ITEMS,
          cqItemsOrder: ITEMS_ORDER,
        }),
      );
      expect(ComponentMappingSpy).toHaveBeenCalledWith(COMPONENT_TYPE1);
      expect(ComponentMappingSpy).toHaveBeenCalledWith(COMPONENT_TYPE2);
      const node = screen.getByTestId('testcontainer');
      const containerPlaceholder = node.querySelector(CONTAINER_PLACEHOLDER_SELECTOR);
      expect(containerPlaceholder).toBeTruthy();
      const childItem1 = node.querySelector(ITEM1_DATA_ATTRIBUTE_SELECTOR);
      const childItem2 = node.querySelector(ITEM2_DATA_ATTRIBUTE_SELECTOR);
      expect(childItem1).toBeTruthy();
      expect(childItem2).toBeTruthy();
    });

    it('should add the expected item classes when passed', () => {
      ComponentMappingSpy.mockReturnValue(ComponentChild);
      render(
        generateContainerComponent({
          isInEditor: false,
          cqPath: '',
          cqItems: ITEMS,
          cqItemsOrder: ITEMS_ORDER,
          getItemClassNames,
        }),
      );
      const node = screen.getByTestId('testcontainer');
      const childItem1 = node.querySelector('#c1.' + COMPONENT_1_CLASS_NAMES);
      const childItem2 = node.querySelector('#c2.' + COMPONENT_2_CLASS_NAMES);
      expect(childItem1).toBeTruthy();
      expect(childItem2).toBeTruthy();
    });

    it('should support component mapping via prop', () => {
      const MapComponentsSpy = jest.spyOn(ComponentMapping, 'map');
      render(
        generateContainerComponent({
          components: { [COMPONENT_TYPE2]: ComponentChild },
        }),
      );
      expect(MapComponentsSpy).toBeCalledWith(COMPONENT_TYPE2, ComponentChild);
    });
  });

  describe('Data attributes ->', () => {
    it('should not add a the cq-data-path attribute if not in WCM edit mode', () => {
      render(generateContainerComponent({ isInEditor: false }));
      const node = screen.getByTestId('testcontainer');
      const container = node.querySelector('[data-cq-data-path="/container"]');
      expect(container).toBeNull();
    });

    it('should add a the cq-data-path attribute if in WCM edit mode', () => {
      render(generateContainerComponent({}));
      const node = screen.getByTestId('testcontainer');
      const container = node.querySelector('[data-cq-data-path="/container"]');
      expect(container).toBeTruthy();
    });
  });
});
