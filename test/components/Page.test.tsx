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
import { ComponentMapping, MappedComponentProperties, withComponentMappingContext } from '../../src/ComponentMapping';
import { withEditable } from '../../src/components/EditableComponent';
import { Page, PageProperties } from '../../src/components/Page';
import { EditorContext, withEditorContext } from '../../src/EditorContext';

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

    interface PageModel extends PageProperties {
        ':type': string;
        'id': string;
        ':path': string;
    }

    const CHILDREN: { [key: string]: PageModel } = {
        'page1': {
            cqChildren: {},
            cqItems: {},
            cqItemsOrder: [],
            cqPath: '',
            isInEditor: false,
            ':type': PAGE_TYPE1,
            'id': 'p1',
            ':path': 'child/page1'
        },
        'page2': {
            cqChildren: {},
            cqItems: {},
            cqItemsOrder: [],
            cqPath: '',
            isInEditor: false,
            ':type': PAGE_TYPE2,
            'id': 'p2',
            ':path': 'child/page2'
        }
    };

    let rootNode: any;
    let EditorContextPage: any;
    let ComponentMappingSpy: any;

    interface DummyProps extends MappedComponentProperties {
        id: string
    }

    class ChildComponent extends Component<DummyProps> {
        render() {
            return <div id={this.props.id} className={CHILD_COMPONENT_CLASS_NAME}></div>;
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
        it('should add the expected children', () => {
            ComponentMappingSpy.mockReturnValue(ChildComponent);

            const element = <Page
                componentMapping={ComponentMapping}
                cqPath={PAGE_PATH}
                cqChildren={CHILDREN}
                cqItems={ITEMS}
                cqItemsOrder={ITEMS_ORDER}
                isInEditor={false}></Page>;

            ReactDOM.render(element, rootNode);
            expect(ComponentMappingSpy).toHaveBeenCalledWith(COMPONENT_TYPE1);
            expect(ComponentMappingSpy).toHaveBeenCalledWith(COMPONENT_TYPE2);

            const childItem1 = rootNode.querySelector('#c1');
            const childItem2 = rootNode.querySelector('#c2');

            expect(childItem1).toBeDefined();
            expect(childItem2).toBeDefined();

            const childPage1 = rootNode.querySelector('#p1');
            const childPage2 = rootNode.querySelector('#p2');

            expect(childPage1).toBeDefined();
            expect(childPage2).toBeDefined();
        });

        it('should add the expected children with data attributes when in WCM edit mode', () => {
            const EditableChildComponent = withEditable(ChildComponent);

            ComponentMappingSpy.mockImplementation((key: string) => {
                switch (key) {
                    case COMPONENT_TYPE1:
                    case COMPONENT_TYPE2:
                        return EditableChildComponent;

                    case PAGE_TYPE1:
                    case PAGE_TYPE2:
                        return EditorContextPage;

                    default:
                        return null;
                }
            });

            const element = (
              <EditorContext.Provider value={ true }>
                <Page componentMapping={ComponentMapping}
                    isInEditor={true}
                    cqPath={PAGE_PATH}
                    cqChildren={CHILDREN}
                    cqItems={ITEMS}
                    cqItemsOrder={ITEMS_ORDER}></Page>
              </EditorContext.Provider>
            );

            ReactDOM.render(element, rootNode);

            expect(ComponentMappingSpy).toHaveBeenCalledWith(COMPONENT_TYPE1);
            expect(ComponentMappingSpy).toHaveBeenCalledWith(COMPONENT_TYPE2);

            const childItem1 = rootNode.querySelector(ITEM1_DATA_ATTRIBUTE_SELECTOR);
            const childItem2 = rootNode.querySelector(ITEM2_DATA_ATTRIBUTE_SELECTOR);

            expect(childItem1).toBeDefined();
            expect(childItem2).toBeDefined();

            const childPage1 = rootNode.querySelector(CHILD_PAGE_1_DATA_ATTRIBUTE_SELECTOR);
            const childPage2 = rootNode.querySelector(CHILD_PAGE_2_DATA_ATTRIBUTE_SELECTOR);

            expect(childPage1).toBeDefined();
            expect(childPage2).toBeDefined();
        });
    });
});
