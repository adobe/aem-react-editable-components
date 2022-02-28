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
import { ComponentMapping, MappedComponentProperties, MapTo } from '../src/core/ComponentMapping';
import { EditConfig } from '../src/core/EditableComponent';

describe('ComponentMapping', () => {
  interface Props extends MappedComponentProperties {
    src?: string;
  }

  const COMPONENT_RESOURCE_TYPE = 'test/component/resource/type';
  const editConfig: EditConfig<Props> = {
    emptyLabel: 'Image',

    isEmpty: function (props) {
      return !props || !props.src || props.src.trim().length < 1;
    },
  };

  class TestComponent extends Component<Props> {
    render() {
      return <div />;
    }
  }

  it('should store and retrieve component', () => {
    const spy = jest.spyOn(document.head, 'querySelector').mockReturnValue({ content: 'edit' } as any);

    const WrappedReturnType = MapTo(COMPONENT_RESOURCE_TYPE)(TestComponent, editConfig);

    const WrappedComponentFromGet = ComponentMapping.get(COMPONENT_RESOURCE_TYPE);

    expect(WrappedComponentFromGet).toBeDefined();
    expect(WrappedReturnType).toBeDefined();

    expect(WrappedReturnType).toBe(WrappedComponentFromGet);

    spy.mockRestore();
  });
});
