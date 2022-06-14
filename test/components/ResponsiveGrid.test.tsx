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
import { AuthoringUtils, ModelManager } from '@adobe/aem-spa-page-model-manager';
import { ComponentMapping } from '../../src/core/ComponentMapping';
import { ResponsiveGrid } from '../../src/components/ResponsiveGrid';
import { AllowedComponentList } from '../../src/types/AEMModel';

describe('ResponsiveGrid ->', () => {
  const CONTAINER_PLACEHOLDER_SELECTOR = '.new.section';
  const CONTAINER_PLACEHOLDER_DATA_ATTRIBUTE_SELECTOR = '[data-cq-data-path="/container/*"]';
  const ITEM_CLASS_NAME = 'item-class';
  const CONTAINER_PATH = '/container';
  const ITEM1_DATA_ATTRIBUTE_SELECTOR = '[data-cq-data-path="/container/component1"]';
  const ITEM2_DATA_ATTRIBUTE_SELECTOR = '[data-cq-data-path="/container/component2"]';
  const GRID_CLASS_NAMES = 'grid-class-names';
  const COLUMN_1_CLASS_NAMES = 'column-class-names-1';
  const COLUMN_2_CLASS_NAMES = 'column-class-names-2';
  const PLACEHOLDER_CLASS_NAMES = 'aem-Grid-newComponent';
  const COMPONENT_TYPE1 = 'components/c1';
  const COMPONENT_TYPE2 = 'components/c2';
  const COMPONENT_TEXT_PATH = '/content/page/jcr:content/root/text';
  const COMPONENT_TEXT_TITLE = 'Text';
  const CUSTOM_TITLE = 'Custom Container';
  const ALLOWED_PLACEHOLDER_SELECTOR = '.aem-AllowedComponent--list';
  const ALLOWED_COMPONENT_TITLE_SELECTOR = '.aem-AllowedComponent--title';
  const ALLOWED_TEXT_COMPONENT_PLACEHOLDER_SELECTOR =
    '.aem-AllowedComponent--component.cq-placeholder.placeholder[data-cq-data-path="/content/page/jcr:content/root/text"]';
  const DEFAULT_PLACEHOLDER_SELECTOR = '.cq-placeholder';

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

  const ITEMS_ORDER = ['component1', 'component2'];

  const COLUMN_CLASS_NAMES = {
    component1: COLUMN_1_CLASS_NAMES,
    component2: COLUMN_2_CLASS_NAMES,
  };

  const ComponentChild = ({ id = '' }) => <div id={id} className={ITEM_CLASS_NAME} />;

  const allowedComp: AllowedComponentList = {
    applicable: false,
    components: [],
  };

  const allowedCompTrue: AllowedComponentList = {
    applicable: true,
    components: [
      {
        path: COMPONENT_TEXT_PATH,
        title: COMPONENT_TEXT_TITLE,
      },
    ],
  };

  const STANDARD_GRID_PROPS = {
    cqPath: CONTAINER_PATH,
    gridClassNames: GRID_CLASS_NAMES,
    columnClassNames: {},
    allowedComponents: allowedComp,
    componentMapping: ComponentMapping,
    cqItems: {},
    cqItemsOrder: [],
    isInEditor: false,
    cqType: '',
  };

  let ComponentMappingSpy: jest.SpyInstance;
  let addListenerSpy: jest.SpyInstance;
  let removeListenerSpy: jest.SpyInstance;
  let getDataSpy: jest.SpyInstance;
  let isInEditorSpy: jest.SpyInstance;

  function generateResponsiveGrid(customProps) {
    const props = {
      ...STANDARD_GRID_PROPS,
      ...customProps,
    };
    return (
      <div data-testid="gridComponent">
        <ResponsiveGrid {...props} />
      </div>
    );
  }
  beforeEach(() => {
    ComponentMappingSpy = jest.spyOn(ComponentMapping, 'get');
    getDataSpy = jest.spyOn(ModelManager, 'getData').mockResolvedValue({});
    addListenerSpy = jest.spyOn(ModelManager, 'addListener').mockImplementation();
    removeListenerSpy = jest.spyOn(ModelManager, 'removeListener').mockImplementation();
    isInEditorSpy = jest.spyOn(AuthoringUtils, 'isInEditor').mockReturnValue(false);
  });

  afterEach(() => {
    ComponentMappingSpy.mockRestore();
    addListenerSpy.mockReset();
    removeListenerSpy.mockReset();
    getDataSpy.mockReset();
    isInEditorSpy.mockReset();
  });

  describe('Grid class names ->', () => {
    it('should add the grid class names', () => {
      render(generateResponsiveGrid({}));
      const node = screen.getByTestId('gridComponent');
      expect(node.querySelector('.' + GRID_CLASS_NAMES)).toBeTruthy();
    });
  });

  describe('Placeholder ->', () => {
    it('should add the expected placeholder class names', () => {
      render(generateResponsiveGrid({}));
      const node = screen.getByTestId('gridComponent');
      const gridPlaceholder = node.querySelector(
        '.' + PLACEHOLDER_CLASS_NAMES + CONTAINER_PLACEHOLDER_SELECTOR + CONTAINER_PLACEHOLDER_DATA_ATTRIBUTE_SELECTOR,
      );
      expect(gridPlaceholder).toBeDefined();
    });
  });

  describe('Column class names ->', () => {
    it('should add the expected column class names', () => {
      ComponentMappingSpy.mockReturnValue(ComponentChild);
      render(
        generateResponsiveGrid({ columnClassNames: COLUMN_CLASS_NAMES, cqItems: ITEMS, cqItemsOrder: ITEMS_ORDER }),
      );
      const node = screen.getByTestId('gridComponent');
      const childItem1 = node.querySelector('.' + COLUMN_1_CLASS_NAMES + ITEM1_DATA_ATTRIBUTE_SELECTOR);
      const childItem2 = node.querySelector('.' + COLUMN_2_CLASS_NAMES + ITEM2_DATA_ATTRIBUTE_SELECTOR);
      expect(childItem1).toBeDefined();
      expect(childItem2).toBeDefined();
    });
  });

  describe('Allowed Component Container ->', () => {
    it('should add the Allowed Component Container', () => {
      ComponentMappingSpy.mockReturnValue(ComponentChild);
      render(
        generateResponsiveGrid({
          allowedComponents: allowedCompTrue,
          isInEditor: true,
          title: 'Custom Container',
        }),
      );
      const node = screen.getByTestId('gridComponent');

      const allowedComponentsContainer = node.querySelector(ALLOWED_PLACEHOLDER_SELECTOR);
      const allowedComponentsTitle = allowedComponentsContainer.querySelector(
        ALLOWED_COMPONENT_TITLE_SELECTOR,
      ) as HTMLElement;
      expect(allowedComponentsTitle).toBeDefined();
      expect(allowedComponentsTitle.dataset.text).toEqual(CUSTOM_TITLE);
      expect(allowedComponentsContainer.querySelector(ALLOWED_TEXT_COMPONENT_PLACEHOLDER_SELECTOR)).toBeTruthy();
    });
  });

  describe('No Default Placeholder ->', () => {
    it('should not add default placeholder', () => {
      isInEditorSpy = jest.spyOn(AuthoringUtils, 'isInEditor').mockReturnValue(true);
      ComponentMappingSpy.mockReturnValue(ComponentChild);
      render(generateResponsiveGrid({ cqItems: ITEMS, cqItemsOrder: ITEMS_ORDER }));
      const node = screen.getByTestId('gridComponent');
      const defaultPlaceholderSelector = node.querySelector(DEFAULT_PLACEHOLDER_SELECTOR);
      expect(defaultPlaceholderSelector).toBeNull();
    });
  });
});
