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
import ReactDOM from 'react-dom';
import { MappedComponentProperties } from '../src/ComponentMapping';
import { PLACEHOLDER_CLASS_NAME, withEditable } from '../src/components/EditableComponent';
import Utils from '../src/Utils';

describe('EditableComponent ->', () => {
    const ROOT_CLASS_NAME = 'root-class';
    const COMPONENT_RESOURCE_TYPE = '/component/resource/type';
    const COMPONENT_PATH = '/path/to/component';
    const CHILD_COMPONENT_CLASS_NAME = 'child-class';
    const IN_EDITOR_CLASS_NAME = 'in-editor-class';
    const EMPTY_LABEL = 'Empty Label';
    const EMPTY_TEXT_SELECTOR = '[data-emptytext="' + EMPTY_LABEL + '"]';
    const DATA_PATH_ATTRIBUTE_SELECTOR = '[data-cq-data-path="' + COMPONENT_PATH + '"]';

    const CQ_PROPS = {
        'cqType': COMPONENT_RESOURCE_TYPE,
        'cqPath': COMPONENT_PATH
    };

    let rootNode: any;
    let sandbox: jest.SpyInstance;
    let isInEditor = false;

    interface ChildComponentProps extends MappedComponentProperties {
        id?: string
    }

    class ChildComponent extends Component<ChildComponentProps> {
        render() {
            const editorClassNames = this.props.isInEditor ? IN_EDITOR_CLASS_NAME : '';

            return <div id={this.props.id} className={CHILD_COMPONENT_CLASS_NAME + ' ' + editorClassNames} />;
        }
    }

    beforeEach(() => {
        sandbox = jest.spyOn(Utils, 'isInEditor').mockImplementation(() => isInEditor);
        rootNode = document.createElement('div');
        rootNode.className = ROOT_CLASS_NAME;
        document.body.appendChild(rootNode);
    });

    afterEach(() => {
        sandbox.mockRestore();

        if (rootNode) {
            document.body.appendChild(rootNode);
            rootNode = undefined;
        }
    });

    describe('Component emptiness ->', () => {
        it('should declare the component to be empty', () => {
            const EDIT_CONFIG = {
                isEmpty: function () {
                    return true;
                },
                emptyLabel: EMPTY_LABEL
            };

            const EditableComponent: any = withEditable(ChildComponent, EDIT_CONFIG);
            const element: JSX.Element = <EditableComponent isInEditor={true} {...CQ_PROPS} />;

            ReactDOM.render(element, rootNode);

            const node = rootNode.querySelector(DATA_PATH_ATTRIBUTE_SELECTOR + ' .' + CHILD_COMPONENT_CLASS_NAME + ' + .' + PLACEHOLDER_CLASS_NAME + EMPTY_TEXT_SELECTOR);

            expect(node).toBeDefined();
        });

        it('should declare the component to be empty without providing a label', () => {
            const EDIT_CONFIG = {
                isEmpty: function () {
                    return true;
                }
            };

            isInEditor = true;

            const EditableComponent: any = withEditable(ChildComponent, EDIT_CONFIG);

            ReactDOM.render(<EditableComponent isInEditor={true} {...CQ_PROPS}/>, rootNode);

            let node = rootNode.querySelector(DATA_PATH_ATTRIBUTE_SELECTOR + ' .' + PLACEHOLDER_CLASS_NAME + EMPTY_TEXT_SELECTOR);

            expect(node).toBeNull();

            node = rootNode.querySelector(DATA_PATH_ATTRIBUTE_SELECTOR + ' .' + CHILD_COMPONENT_CLASS_NAME + ' + .' + PLACEHOLDER_CLASS_NAME);

            expect(node).toBeDefined();
        });

        it('should declare the component as not being in the editor', () => {
            const EDIT_CONFIG = {
                isEmpty: function () {
                    return true;
                }
            };

            isInEditor = true;

            const EditableComponent: any = withEditable(ChildComponent, EDIT_CONFIG);

            ReactDOM.render(<EditableComponent isInEditor={false} {...CQ_PROPS}/>, rootNode);

            let node = rootNode.querySelector('.' + PLACEHOLDER_CLASS_NAME + EMPTY_TEXT_SELECTOR);

            expect(node).toBeNull();

            node = rootNode.querySelector(DATA_PATH_ATTRIBUTE_SELECTOR + ' .' + CHILD_COMPONENT_CLASS_NAME + ' + .' + PLACEHOLDER_CLASS_NAME);

            expect(node).toBeNull();
        });

        it('should declare the component not to be empty', () => {
            const EDIT_CONFIG = {
                isEmpty: function () {
                    return false;
                },
                emptyLabel: EMPTY_LABEL
            };

            const EditableComponent: any = withEditable(ChildComponent, EDIT_CONFIG);

            ReactDOM.render(<EditableComponent isInEditor={true} {...CQ_PROPS}/>, rootNode);

            let node = rootNode.querySelector('.' + CHILD_COMPONENT_CLASS_NAME + ' + .' + PLACEHOLDER_CLASS_NAME);

            expect(node).toBeNull();

            node = rootNode.querySelector(DATA_PATH_ATTRIBUTE_SELECTOR + ' .' + CHILD_COMPONENT_CLASS_NAME);

            expect(node).toBeDefined();
        });
    });
});
