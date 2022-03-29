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
import { Model } from '@adobe/aem-spa-page-model-manager';
import {
  ComponentMapping,
  MappedComponentProperties,
  withComponentMappingContext,
} from '../../src/core/ComponentMapping';
import { Page } from '../../src/components/Page';
import { EditorContext, withEditorContext } from '../../src/delete/EditorContext';

describe('Page ->', () => {
  const ROOT_CLASS_NAME = 'root-class';
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

  let rootNode: Element;
  let EditorContextPage: any;
  let ComponentMappingSpy: jest.SpyInstance;

  interface DummyProps extends MappedComponentProperties {
    id: string;
  }

  class ChildComponent extends Component<DummyProps> {
    render() {
      return (
        <div id={this.props.id} className={CHILD_COMPONENT_CLASS_NAME} data-cq-data-path={this.props.cqPath}></div>
      );
    }
  }

  beforeEach(() => {
    ComponentMappingSpy = jest.spyOn(ComponentMapping, 'get');
    EditorContextPage = withComponentMappingContext(withEditorContext(Page));
    EditorContextPage.test = true;
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

  describe('child pages ->', () => {
    it('should render only components if no children', () => {
      ComponentMappingSpy.mockReturnValue(ChildComponent);

      const element = (
        <Page
          componentMapping={ComponentMapping}
          cqPath={PAGE_PATH}
          cqItems={ITEMS}
          cqItemsOrder={ITEMS_ORDER}
          isInEditor={true}
        ></Page>
      );
      ReactDOM.render(element, rootNode);

      expect(rootNode.querySelector('#c1')).toBeTruthy();
      expect(rootNode.querySelector('#c2')).toBeTruthy();

      expect(rootNode.querySelector('#p1')).toBeNull();
      expect(rootNode.querySelector('#p2')).toBeNull();
    });

    it('should add the expected children', () => {
      ComponentMappingSpy.mockReturnValue(ChildComponent);

      const element = (
        <Page
          componentMapping={ComponentMapping}
          cqPath={PAGE_PATH}
          cqChildren={CHILDREN}
          cqItems={ITEMS}
          cqItemsOrder={ITEMS_ORDER}
          isInEditor={true}
        ></Page>
      );

      ReactDOM.render(element, rootNode);
      expect(ComponentMappingSpy).toHaveBeenCalledWith(COMPONENT_TYPE1);
      expect(ComponentMappingSpy).toHaveBeenCalledWith(COMPONENT_TYPE2);

      const childItem1 = rootNode.querySelector('#c1');
      const childItem2 = rootNode.querySelector('#c2');

      expect(childItem1).toBeTruthy();
      expect(childItem2).toBeTruthy();

      const childPage1 = rootNode.querySelector('#p1');
      const childPage2 = rootNode.querySelector('#p2');

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
            return EditorContextPage;

          default:
            return null;
        }
      });

      const element = (
        <EditorContext.Provider value={true}>
          <Page
            componentMapping={ComponentMapping}
            isInEditor={true}
            cqPath={PAGE_PATH}
            cqChildren={CHILDREN}
            cqItems={ITEMS}
            cqItemsOrder={ITEMS_ORDER}
          ></Page>
        </EditorContext.Provider>
      );

      ReactDOM.render(element, rootNode);

      expect(ComponentMappingSpy).toHaveBeenCalledWith(COMPONENT_TYPE1);
      expect(ComponentMappingSpy).toHaveBeenCalledWith(COMPONENT_TYPE2);

      const childItem1 = rootNode.querySelector(ITEM1_DATA_ATTRIBUTE_SELECTOR);
      const childItem2 = rootNode.querySelector(ITEM2_DATA_ATTRIBUTE_SELECTOR);

      expect(childItem1).toBeTruthy();
      expect(childItem2).toBeTruthy();

      const childPage1 = rootNode.querySelector(CHILD_PAGE_1_DATA_ATTRIBUTE_SELECTOR);
      const childPage2 = rootNode.querySelector(CHILD_PAGE_2_DATA_ATTRIBUTE_SELECTOR);

      expect(childPage1).toBeTruthy();
      expect(childPage2).toBeTruthy();
    });
  });
});
