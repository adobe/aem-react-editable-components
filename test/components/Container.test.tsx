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
import { Container } from '../../src/components/Container';
import { withEditable } from '../../src/components/EditableComponent';

describe('Container ->', () => {
    const CONTAINER_PLACEHOLDER_SELECTOR = '.new.section';
    const CONTAINER_PLACEHOLDER_DATA_ATTRIBUTE_SELECTOR = '[data-cq-data-path="/container/*"]';
    const ROOT_CLASS_NAME = 'root-class';
    const ITEM_CLASS_NAME = 'item-class';
    const CONTAINER_PATH = '/container';
    const ITEM1_DATA_ATTRIBUTE_SELECTOR = '[data-cq-data-path="/container/component1"]';
    const ITEM2_DATA_ATTRIBUTE_SELECTOR = '[data-cq-data-path="/container/component2"]';
    const COMPONENT_TYPE1 = 'components/c1';
    const COMPONENT_TYPE2 = 'components/c2';

    const ITEMS = {
        'component1': {
            ':type': COMPONENT_TYPE1,
            'id': 'c1'
        },
        'component2': {
            ':type': COMPONENT_TYPE2,
            'id': 'c2'
        }
    };

    const ITEMS_ORDER = [ 'component1', 'component2' ];

    interface DummyProps extends MappedComponentProperties {
        id: string
    }

    class ComponentChild extends Component<DummyProps> {
        render() {
            return <div id={this.props && this.props.id} className={ITEM_CLASS_NAME}/>;
        }
    }

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

    describe('childComponents ->', () => {
        it('should add the expected components', () => {
            ComponentMappingSpy.mockReturnValue(ComponentChild);
            ReactDOM.render(<Container componentMapping={ComponentMapping} cqItems={ITEMS} cqItemsOrder={ITEMS_ORDER} cqPath={''} isInEditor={false}/>, rootNode);

            expect(ComponentMappingSpy).toHaveBeenCalledWith(COMPONENT_TYPE1);
            expect(ComponentMappingSpy).toHaveBeenCalledWith(COMPONENT_TYPE2);

            const childItem1 = rootNode.querySelector('#c1');
            const childItem2 = rootNode.querySelector('#c2');

            expect(childItem1).toBeDefined();
            expect(childItem2).toBeDefined();
        });

        it('should add a placeholder with data attribute when in WCM edit mode', () => {
            ReactDOM.render(<Container componentMapping={ComponentMapping} isInEditor={true} cqPath={CONTAINER_PATH}/>, rootNode);

            const containerPlaceholder = rootNode.querySelector(CONTAINER_PLACEHOLDER_DATA_ATTRIBUTE_SELECTOR + CONTAINER_PLACEHOLDER_SELECTOR);

            expect(containerPlaceholder).toBeDefined();
        });

        it('should not add a placeholder when not in WCM edit mode', () => {
            ReactDOM.render(<Container componentMapping={ComponentMapping} isInEditor={false}/>, rootNode);

            const containerPlaceholder = rootNode.querySelector(CONTAINER_PLACEHOLDER_SELECTOR);

            expect(containerPlaceholder).toBeNull();
        });

        it('should add a data attribute on the children when in WCM edit mode', () => {
            ComponentMappingSpy.mockReturnValue(withEditable(ComponentChild));
            ReactDOM.render(<Container componentMapping={ComponentMapping} isInEditor={true} cqPath={CONTAINER_PATH} cqItems={ITEMS} cqItemsOrder={ITEMS_ORDER}/>, rootNode);
            expect(ComponentMappingSpy).toHaveBeenCalledWith(COMPONENT_TYPE1);
            expect(ComponentMappingSpy).toHaveBeenCalledWith(COMPONENT_TYPE2);

            const containerPlaceholder = rootNode.querySelector(CONTAINER_PLACEHOLDER_SELECTOR);

            expect(containerPlaceholder).toBeDefined();

            const childItem1 = rootNode.querySelector(ITEM1_DATA_ATTRIBUTE_SELECTOR);
            const childItem2 = rootNode.querySelector(ITEM2_DATA_ATTRIBUTE_SELECTOR);

            expect(childItem1).toBeDefined();
            expect(childItem2).toBeDefined();
        });
    });

    describe('Data attributes ->', () => {
        it('should not add a the cq-data-path attribute if not in WCM edit mode', () => {
            ReactDOM.render(<Container componentMapping={ComponentMapping} cqPath={CONTAINER_PATH} isInEditor={false}/>, rootNode);

            const container = rootNode.querySelector('[data-cq-data-path="/container"]');

            expect(container).toBeNull();
        });

        it('should add a the cq-data-path attribute if in WCM edit mode', () => {
            ReactDOM.render(<Container componentMapping={ComponentMapping} isInEditor={true} cqPath={CONTAINER_PATH}/>, rootNode);

            const container = rootNode.querySelector('[data-cq-data-path="/container"]');

            expect(container).toBeDefined();
        });
    });
});
