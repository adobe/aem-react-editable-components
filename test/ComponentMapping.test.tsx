/*
 * ADOBE CONFIDENTIAL
 *
 * Copyright 2018 Adobe Systems Incorporated
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
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
