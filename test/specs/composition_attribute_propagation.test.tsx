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

import { ModelManager } from '@adobe/cq-spa-page-model-manager';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withEditable } from '../../src/components/EditableComponent';
import { withModel } from '../../src/components/ModelProvider';
import { withEditorContext } from '../../src/EditorContext';
import Utils from '../../src/Utils';

describe('Composition and attribute propagation ->', () => {
    const ROOT_CLASS_NAME = 'root-class';
    const COMPONENT_RESOURCE_TYPE = '/component/resource/type';
    const COMPONENT_PATH = '/path/to/component';
    const CHILD_COMPONENT_CLASS_NAME = 'child-class';
    const DATA_ATTR_TO_PROPS = 'data-attr-to-props';

    const CQ_PROPS = {
        'cqType': COMPONENT_RESOURCE_TYPE,
        'cqPath': COMPONENT_PATH
    };

    interface DummyProps{
        attrToProps: string;
        id: string;
    }

    class ChildComponent extends Component<DummyProps> {
        render() {
            const attr = {
                [DATA_ATTR_TO_PROPS]: this.props.attrToProps
            };

            return <div id={this.props.id} className={CHILD_COMPONENT_CLASS_NAME} {...attr}/>;
        }
    }

    let rootNode: any;
    let isInEditorSpy: jest.SpyInstance;
    let addListenerSpy: jest.SpyInstance;
    let getDataSpy: jest.SpyInstance;

    beforeEach(() => {
        rootNode = document.createElement('div');
        rootNode.className = ROOT_CLASS_NAME;
        document.body.appendChild(rootNode);
        isInEditorSpy = jest.spyOn(Utils, 'isInEditor').mockReturnValue(false);
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

    /**
     * Sets a property on the provided CompositeComponent then updates it
     *
     * @param CompositeComponent
     */
    function testCompositionAttributePropagation(CompositeComponent: any) {
        ReactDOM.render(<CompositeComponent {...CQ_PROPS} attrToProps={true}/>, rootNode);

        let node = rootNode.querySelector('[' + DATA_ATTR_TO_PROPS + ']');

        expect(node).toBeDefined();
        expect(node.dataset.attrToProps).toEqual('true');

        // Update the component with new properties
        ReactDOM.render(<CompositeComponent {...CQ_PROPS} attrToProps={false}/>, rootNode);

        node = rootNode.querySelector('[' + DATA_ATTR_TO_PROPS + ']');
        expect(node).toBeDefined();
        expect(node.dataset.attrToProps).toEqual('false');
    }

    describe('withEditable ->', () => {
        it('should propagate attributes to properties', () => {
            testCompositionAttributePropagation(withEditable(ChildComponent));
        });
    });

    describe('withModel ->', () => {
        it('should propagate attributes to properties', () => {
            testCompositionAttributePropagation(withModel(ChildComponent));
        });
    });

    describe('withEditorContext ->', () => {
        it('should propagate attributes to properties', () => {
            testCompositionAttributePropagation(withEditorContext(ChildComponent));
        });
    });

    describe('withEditorContext + withModel + withEditable ->', () => {
        it('should propagate attributes to properties', () => {
            testCompositionAttributePropagation(withEditorContext(withModel(withEditable(ChildComponent))));
        });
    });
});
