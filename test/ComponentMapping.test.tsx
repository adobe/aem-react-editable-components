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
import { ComponentMapping, MapTo } from '../src/ComponentMapping';
import { EditConfig } from '../src/components/EditableComponent';

describe('ComponentMapping', () => {
    const COMPONENT_RESOURCE_TYPE = 'test/component/resource/type';
    const editConfig: EditConfig = {
        emptyLabel: 'Image',

        isEmpty: function(props) {
            return !props || !props.src || (props.src.trim().length < 1);
        }
    };

    class TestComponent extends Component {
        render () {
            return <div/>;
        }
    }

    it('should store and retrieve component', () => {
        const spy = jest.spyOn(document.head, 'querySelector').mockReturnValue({ content: 'edit' } as any);

        MapTo(COMPONENT_RESOURCE_TYPE)(TestComponent, editConfig);

        const WrappedTestComponent = ComponentMapping.get(COMPONENT_RESOURCE_TYPE);

        expect(WrappedTestComponent).toBeDefined();
        spy.mockRestore();
    });
});
