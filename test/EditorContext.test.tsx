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
import { EditorContext, withEditorContext } from '../src/EditorContext';

describe('EditorContext ->', () => {
    const ROOT_CLASS_NAME = 'root-class';
    const CHILD_COMPONENT_CLASS_NAME = 'child-class';
    const IN_EDITOR_CLASS_NAME = 'in-editor-class';

    let rootNode: any;
    let EditorContextComponent: any;

    interface ChildComponentProps extends MappedComponentProperties {
        id?: string
    }

    class ChildComponent extends Component<ChildComponentProps> {
        render() {
            const editorClassNames = this.props.isInEditor ? IN_EDITOR_CLASS_NAME : '';

            return <div id={this.props.id} className={CHILD_COMPONENT_CLASS_NAME + ' ' + editorClassNames}></div>
        }
    }

    beforeEach(() => {
        EditorContextComponent = withEditorContext(ChildComponent);
        rootNode = document.createElement('div');
        rootNode.className = ROOT_CLASS_NAME;
        document.body.appendChild(rootNode);
    });

    afterEach(() => {
        if (rootNode) {
            document.body.appendChild(rootNode);
            rootNode = undefined;
        }
    });

    describe('Provider/Consumer ->', () => {
        it('should propagate its value - true', () => {
            ReactDOM.render(<EditorContext.Provider value={ true }><EditorContextComponent></EditorContextComponent></EditorContext.Provider>, rootNode);

            const childItem = rootNode.querySelector('.' + IN_EDITOR_CLASS_NAME);

            expect(childItem).toBeDefined();
        });

        it('should propagate its value - false', () => {
            ReactDOM.render(<EditorContext.Provider value={ false }><EditorContextComponent></EditorContextComponent></EditorContext.Provider>, rootNode);

            const childItem = rootNode.querySelector('.' + IN_EDITOR_CLASS_NAME);

            expect(childItem).toBeNull();
        });

    });
});
