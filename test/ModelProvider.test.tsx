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

import { ModelManager } from '@adobe/aem-spa-page-model-manager';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { MappedComponentProperties } from '../src/ComponentMapping';
import { ModelProvider, withModel } from '../src/components/ModelProvider';

describe('ModelProvider ->', () => {
  const TEST_PAGE_PATH = '/page/jcr:content/root';
  const ROOT_NODE_CLASS_NAME = 'root-class';
  const INNER_COMPONENT_ID = 'innerContent';

  let rootNode: any;
  let observer: any;

  /**
   * React warn if a non-standard DOM attribute is used on a native DOM node.
   *
   * When the HTML div element is wrapped to be a React Component it is no longer a DOM node and camelCase properties
   * can be passed to props.
   *
   * If instead of the <ModelProvider><Dummy /></ModelProvider> the <ModelProvider><div /></ModelProvider> notation
   * is used, the following error might be shown in the browser console:
   *
   *      Warning: React does not recognize the `camelCaseProp` prop on a DOM element. If you intentionally want it to
   *      appear in the DOM as a custom attribute, spell it as lowercase `camelcaseprop` instead. If you accidentally
   *      passed it from a parent component, remove it from the DOM element.
   *          in div (created by ModelProvider)
   *          in ModelProvider
   *
   * for every camelCase property passed in props.
   *
   * See also: https://github.com/facebook/react/issues/10590
   */
  interface DummyProps extends MappedComponentProperties {
    className: string;
  }

  class Dummy extends React.Component<DummyProps> {
    render() {
      return (
        <div id={INNER_COMPONENT_ID} className={this.props.className}>
          Dummy
        </div>
      );
    }
  }

  let addListenerSpy: jest.SpyInstance;
  let getDataSpy: jest.SpyInstance;
  let initializeSpy: jest.SpyInstance;

  beforeEach(() => {
    addListenerSpy = jest
      .spyOn(ModelManager, 'addListener')
      .mockImplementation();
    getDataSpy = jest.spyOn(ModelManager, 'getData').mockResolvedValue({});
    initializeSpy = jest
      .spyOn(ModelManager, 'initialize')
      .mockResolvedValue({});

    rootNode = document.createElement('div');
    rootNode.className = ROOT_NODE_CLASS_NAME;
    document.body.appendChild(rootNode);
  });

  afterEach(() => {
    if (observer) {
      observer.disconnect();
    }

    if (rootNode) {
      document.body.removeChild(rootNode);
    }
  });

  describe('Tag instantiation ->', () => {
    beforeEach(() => {
      addListenerSpy.mockReset();
    });

    it('should initialize properly without parameter', () => {
      ReactDOM.render(
        <ModelProvider wrappedComponent={Dummy}></ModelProvider>,
        rootNode
      );

      expect(addListenerSpy).toHaveBeenCalledWith(
        undefined,
        expect.any(Function)
      );

      const childNode = rootNode.querySelector('#' + INNER_COMPONENT_ID);

      expect(childNode).toBeDefined();
    });

    it('should initialize properly with a path parameter', () => {
      ReactDOM.render(
        <ModelProvider
          cqPath={TEST_PAGE_PATH}
          wrappedComponent={Dummy}
        ></ModelProvider>,
        rootNode
      );

      expect(addListenerSpy).toHaveBeenCalledWith(
        TEST_PAGE_PATH,
        expect.any(Function)
      );

      const childNode = rootNode.querySelector('#' + INNER_COMPONENT_ID);

      expect(childNode).toBeDefined();
    });
  });

  describe('Get data ->', () => {
    beforeEach(() => {
      getDataSpy.mockReset();
      addListenerSpy.mockReset();
    });

    it('should subscribe on the data with undefined parameters', () => {
      getDataSpy.mockResolvedValue({});
      ReactDOM.render(
        <ModelProvider wrappedComponent={Dummy}></ModelProvider>,
        rootNode
      );

      expect(addListenerSpy).toHaveBeenCalledWith(
        undefined,
        expect.any(Function)
      );
    });

    it('should subscribe on the data with the provided attributes', () => {
      getDataSpy.mockResolvedValue({});
      ReactDOM.render(
        <ModelProvider
          cqPath={TEST_PAGE_PATH}
          cqForceReload={true}
          wrappedComponent={Dummy}
        ></ModelProvider>,
        rootNode
      );

      expect(addListenerSpy).toHaveBeenCalledWith(
        TEST_PAGE_PATH,
        expect.any(Function)
      );
    });
  });

  describe('withModel ->', () => {
    beforeEach(() => {
      addListenerSpy.mockReset();
    });

    it('should initialize properly without parameter', () => {
      const DummyWithModel: any = withModel(Dummy);
      ReactDOM.render(<DummyWithModel></DummyWithModel>, rootNode);

      expect(addListenerSpy).toHaveBeenCalledWith(
        undefined,
        expect.any(Function)
      );

      const childNode = rootNode.querySelector('#' + INNER_COMPONENT_ID);

      expect(childNode).toBeDefined();
    });

    it('should initialize properly with a path parameter', () => {
      const DummyWithModel = withModel(Dummy);

      ReactDOM.render(
        // @ts-ignore
        <DummyWithModel cqPath={TEST_PAGE_PATH}></DummyWithModel>,
        rootNode
      );

      expect(addListenerSpy).toHaveBeenCalledWith(
        TEST_PAGE_PATH,
        expect.any(Function)
      );

      const childNode = rootNode.querySelector('#' + INNER_COMPONENT_ID);

      expect(childNode).toBeDefined();
    });

    it('should render a subpage properly when page path is provided', () => {
      const DummyWithModel = withModel(Dummy, { injectPropsOnInit: true });
      ReactDOM.render(
        // @ts-ignore
        <DummyWithModel pagePath={TEST_PAGE_PATH}></DummyWithModel>,
        rootNode
      );

      expect(getDataSpy).toHaveBeenCalledWith({
        path: TEST_PAGE_PATH,
        forceReload: false,
      });

      const childNode = rootNode.querySelector('#' + INNER_COMPONENT_ID);

      expect(childNode).toBeDefined();
    });

    it('should render components properly when component cqPath is provided', () => {
      const DummyWithModel = withModel(Dummy, { injectPropsOnInit: true });
      ReactDOM.render(
        // @ts-ignore
        <DummyWithModel cqPath={TEST_PAGE_PATH}></DummyWithModel>,
        rootNode
      );

      expect(getDataSpy).toHaveBeenCalledWith({
        path: TEST_PAGE_PATH,
        forceReload: false,
      });

      const childNode = rootNode.querySelector('#' + INNER_COMPONENT_ID);

      expect(childNode).toBeDefined();
    });

    it('should render components properly when containing page path and path to item is provided', () => {
      const PAGE_PATH = '/page/subpage';
      const ITEM_PATH = 'root/paragraph';

      const DummyWithModel = withModel(Dummy, { injectPropsOnInit: true });
      ReactDOM.render(
        <DummyWithModel
        // @ts-ignore
          pagePath={PAGE_PATH}
          itemPath={ITEM_PATH}
        ></DummyWithModel>,
        rootNode
      );

      expect(getDataSpy).toHaveBeenCalledWith({
        path: `${PAGE_PATH}/jcr:content/${ITEM_PATH}`,
        forceReload: false,
      });

      const childNode = rootNode.querySelector('#' + INNER_COMPONENT_ID);

      expect(childNode).toBeDefined();
    });
  });
});
