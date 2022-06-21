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

import { AuthoringUtils, ModelManager } from '@adobe/aem-spa-page-model-manager';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { MappedComponentProperties } from '../../src/core/ComponentMapping';

describe('Composition and attribute propagation ->', () => {
  const ROOT_CLASS_NAME = 'root-class';
  const COMPONENT_RESOURCE_TYPE = '/component/resource/type';
  const COMPONENT_PATH = '/path/to/component';
  const CHILD_COMPONENT_CLASS_NAME = 'child-class';
  const DATA_ATTR_TO_PROPS = 'data-attr-to-props';

  interface DummyProps extends MappedComponentProperties {
    cqType: string;
    attrToProps?: string;
    id: string;
  }

  const CQ_PROPS: DummyProps = {
    cqType: COMPONENT_RESOURCE_TYPE,
    cqPath: COMPONENT_PATH,
    isInEditor: false,
    id: '',
  };

  class ChildComponent extends Component<DummyProps> {
    render() {
      const attr = {
        [DATA_ATTR_TO_PROPS]: this.props.attrToProps,
      };

      return <div id={this.props.id} className={CHILD_COMPONENT_CLASS_NAME} {...attr} />;
    }
  }

  let rootNode: HTMLElement;
  let isInEditorSpy: jest.SpyInstance;
  let addListenerSpy: jest.SpyInstance;
  let getDataSpy: jest.SpyInstance;

  beforeEach(() => {
    rootNode = document.createElement('div');
    rootNode.className = ROOT_CLASS_NAME;
    document.body.appendChild(rootNode);
    isInEditorSpy = jest.spyOn(AuthoringUtils, 'isInEditor').mockReturnValue(false);
    addListenerSpy = jest.spyOn(ModelManager, 'addListener').mockImplementation();
    getDataSpy = jest.spyOn(ModelManager, 'getData').mockResolvedValue({});
  });

  afterEach(() => {
    isInEditorSpy.mockRestore();
    addListenerSpy.mockRestore();
    getDataSpy.mockRestore();

    if (rootNode) {
      document.body.appendChild(rootNode);
      rootNode = undefined;
    }
  });
  it('should propagate attributes to properties', () => {
    ReactDOM.render(<ChildComponent {...CQ_PROPS} attrToProps="true" />, rootNode);
    let node = rootNode.querySelector('[' + DATA_ATTR_TO_PROPS + ']') as HTMLElement;

    expect(node).toBeDefined();
    expect(node.dataset.attrToProps).toEqual('true');

    // Update the component with new properties
    ReactDOM.render(<ChildComponent {...CQ_PROPS} attrToProps="false" />, rootNode);

    node = rootNode.querySelector('[' + DATA_ATTR_TO_PROPS + ']');
    expect(node).toBeDefined();
    expect(node.dataset.attrToProps).toEqual('false');
  });
});
