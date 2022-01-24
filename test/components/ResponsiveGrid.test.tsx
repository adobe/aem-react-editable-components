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
import { ComponentMapping, MappedComponentProperties } from '../../src/ComponentMapping';
import { AllowedComponents } from '../../src/components/allowedcomponents/AllowedComponentsContainer';
import { ResponsiveGrid, ResponsiveGridProperties } from '../../src/components/ResponsiveGrid';

describe('ResponsiveGrid ->', () => {
  const CONTAINER_PLACEHOLDER_SELECTOR = '.new.section';
  const CONTAINER_PLACEHOLDER_DATA_ATTRIBUTE_SELECTOR = '[data-cq-data-path="/container/*"]';
  const ROOT_CLASS_NAME = 'root-class';
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

  interface DummyProps extends MappedComponentProperties {
    id: string;
  }

  class ComponentChild extends Component<DummyProps> {
    render() {
      return <div id={this.props && this.props.id} className={ITEM_CLASS_NAME} />;
    }
  }

  const allowedComp: AllowedComponents = {
    applicable: false,
    components: [],
  };

  const STANDARD_GRID_PROPS: ResponsiveGridProperties = {
    cqPath: '',
    gridClassNames: '',
    columnClassNames: {},
    allowedComponents: allowedComp,
    title: '',
    componentMapping: ComponentMapping,
    cqItems: {},
    cqItemsOrder: [],
    isInEditor: false,
  };

  let rootNode: any;
  let ComponentMappingSpy: jest.SpyInstance;

  beforeEach(() => {
    ComponentMappingSpy = jest.spyOn(ComponentMapping, 'get');
    rootNode = document.createElement('div');
    rootNode.className = ROOT_CLASS_NAME;
    document.body.appendChild(rootNode);
  });

  afterEach(() => {
    ComponentMappingSpy.mockRestore();

    if (rootNode) {
      document.body.appendChild(rootNode);
      rootNode = undefined;
    }
  });

  describe('Grid class names ->', () => {
    it('should add the grid class names', () => {
      ReactDOM.render(<ResponsiveGrid {...STANDARD_GRID_PROPS} />, rootNode);

      const gridElement = rootNode.querySelector('.' + GRID_CLASS_NAMES);

      expect(gridElement).toBeDefined();
    });
  });

  describe('Placeholder ->', () => {
    it('should add the expected placeholder class names', () => {
      ReactDOM.render(<ResponsiveGrid {...STANDARD_GRID_PROPS} isInEditor={true} cqPath={CONTAINER_PATH} />, rootNode);

      const gridPlaceholder = rootNode.querySelector(
        '.' + PLACEHOLDER_CLASS_NAMES + CONTAINER_PLACEHOLDER_SELECTOR + CONTAINER_PLACEHOLDER_DATA_ATTRIBUTE_SELECTOR,
      );

      expect(gridPlaceholder).toBeDefined();
    });
  });

  describe('Column class names ->', () => {
    it('should add the expected column class names', () => {
      ComponentMappingSpy.mockReturnValue(ComponentChild);
      ReactDOM.render(
        <ResponsiveGrid
          {...STANDARD_GRID_PROPS}
          isInEditor={true}
          columnClassNames={COLUMN_CLASS_NAMES}
          cqPath={CONTAINER_PATH}
          cqItems={ITEMS}
          cqItemsOrder={ITEMS_ORDER}
        />,
        rootNode,
      );

      const childItem1 = rootNode.querySelector('.' + COLUMN_1_CLASS_NAMES + ITEM1_DATA_ATTRIBUTE_SELECTOR);
      const childItem2 = rootNode.querySelector('.' + COLUMN_2_CLASS_NAMES + ITEM2_DATA_ATTRIBUTE_SELECTOR);

      expect(childItem1).toBeDefined();
      expect(childItem2).toBeDefined();
    });
  });
});
