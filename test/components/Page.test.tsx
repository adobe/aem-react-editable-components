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
import { Model, ModelManager } from '@adobe/aem-spa-page-model-manager';
import { ComponentMapping } from '../../src/core/ComponentMapping';
import { Page } from '../../src/components/Page';

describe('Page ->', () => {
  const CHILD_COMPONENT_CLASS_NAME = 'child-class';
  const PAGE_PATH = '/page';
  const ITEM1_DATA_ATTRIBUTE_SELECTOR = '[data-cq-data-path="/page/jcr:content/component1"]';
  const ITEM2_DATA_ATTRIBUTE_SELECTOR = '[data-cq-data-path="/page/jcr:content/component2"]';
  const CHILD_PAGE_1_DATA_ATTRIBUTE_SELECTOR = '[data-cq-data-path="child/page1"]';
  const CHILD_PAGE_2_DATA_ATTRIBUTE_SELECTOR = '[data-cq-data-path="child/page2"]';
  const COMPONENT_TYPE1 = 'components/c1';
  const COMPONENT_TYPE2 = 'components/c2';
  const PAGE_TYPE1 = 'components/p1';
  const PAGE_TYPE2 = 'components/p2';

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

  type ChildrenProps = {
    id: string;
  } & Model;

  const CHILDREN: { [key: string]: ChildrenProps } = {
    page1: {
      ':children': {},
      ':items': {},
      ':itemsOrder': [],
      ':type': PAGE_TYPE1,
      id: 'p1',
      ':path': 'child/page1',
    },
    page2: {
      ':children': {},
      ':items': {},
      ':itemsOrder': [],
      ':type': PAGE_TYPE2,
      id: 'p2',
      ':path': 'child/page2',
    },
  };

  let ComponentMappingSpy: jest.SpyInstance;
  let addListenerSpy: jest.SpyInstance;
  let removeListenerSpy: jest.SpyInstance;
  let getDataSpy: jest.SpyInstance;

  const ChildComponent = ({ model, cqPath = '' }) => {
    const { id = '' } = model || {};
    return <div id={id} className={CHILD_COMPONENT_CLASS_NAME} data-cq-data-path={cqPath} />;
  };

  function generatePage({ cqChildren = {} }) {
    const props = {
      isInEditor: true,
      componentMapping: ComponentMapping,
      cqPath: PAGE_PATH,
      cqItems: ITEMS,
      cqItemsOrder: ITEMS_ORDER,
      cqChildren,
    };
    return (
      <div data-testid="pageComponent">
        <Page {...props} />
      </div>
    );
  }

  beforeEach(() => {
    ComponentMappingSpy = jest.spyOn(ComponentMapping, 'get');
    getDataSpy = jest.spyOn(ModelManager, 'getData').mockResolvedValue({});
    addListenerSpy = jest.spyOn(ModelManager, 'addListener').mockImplementation();
    removeListenerSpy = jest.spyOn(ModelManager, 'removeListener').mockImplementation();
  });

  afterEach(() => {
    ComponentMappingSpy.mockRestore();
    addListenerSpy.mockReset();
    removeListenerSpy.mockReset();
    getDataSpy.mockReset();
  });

  describe('child pages ->', () => {
    it('should render only components if no children', () => {
      ComponentMappingSpy.mockReturnValue(ChildComponent);
      render(generatePage({}));
      const node = screen.getByTestId('pageComponent');
      expect(node.querySelector('#c1')).toBeTruthy();
      expect(node.querySelector('#c2')).toBeTruthy();
      expect(node.querySelector('#p1')).toBeNull();
      expect(node.querySelector('#p2')).toBeNull();
    });
    it('should render available pages if some are unmapped', () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      ComponentMappingSpy.mockImplementation((type) => type !== PAGE_TYPE2 && ChildComponent);
      render(generatePage({ cqChildren: CHILDREN }));
      const node = screen.getByTestId('pageComponent');
      expect(node.querySelector('#p1')).toBeTruthy();
      expect(node.querySelector('#p2')).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      expect(consoleSpy.mock.calls[0]).toContain(PAGE_TYPE2);
      consoleSpy.mockRestore();
    });
    it('should add the expected children', () => {
      ComponentMappingSpy.mockReturnValue(ChildComponent);
      render(generatePage({ cqChildren: CHILDREN }));
      expect(ComponentMappingSpy).toHaveBeenCalledWith(COMPONENT_TYPE1);
      expect(ComponentMappingSpy).toHaveBeenCalledWith(COMPONENT_TYPE2);
      const node = screen.getByTestId('pageComponent');
      const childItem1 = node.querySelector('#c1');
      const childItem2 = node.querySelector('#c1');
      expect(childItem1).toBeTruthy();
      expect(childItem2).toBeTruthy();

      const childPage1 = node.querySelector('#p1');
      const childPage2 = node.querySelector('#p2');
      expect(childPage1).toBeTruthy();
      expect(childPage2).toBeTruthy();
    });

    it('should add the expected children with data attributes when in WCM edit mode', () => {
      ComponentMappingSpy.mockImplementation((key: string) => {
        switch (key) {
          case COMPONENT_TYPE1:
          case COMPONENT_TYPE2:
            return ChildComponent;

          case PAGE_TYPE1:
          case PAGE_TYPE2:
            return Page;

          default:
            return null;
        }
      });

      render(generatePage({ cqChildren: CHILDREN }));
      expect(ComponentMappingSpy).toHaveBeenCalledWith(COMPONENT_TYPE1);
      expect(ComponentMappingSpy).toHaveBeenCalledWith(COMPONENT_TYPE2);
      const node = screen.getByTestId('pageComponent');
      const childItem1 = node.querySelector(ITEM1_DATA_ATTRIBUTE_SELECTOR);
      const childItem2 = node.querySelector(ITEM2_DATA_ATTRIBUTE_SELECTOR);
      expect(childItem1).toBeTruthy();
      expect(childItem2).toBeTruthy();

      const childPage1 = node.querySelector(CHILD_PAGE_1_DATA_ATTRIBUTE_SELECTOR);
      const childPage2 = node.querySelector(CHILD_PAGE_2_DATA_ATTRIBUTE_SELECTOR);
      expect(childPage1).toBeTruthy();
      expect(childPage2).toBeTruthy();
    });
  });
});
