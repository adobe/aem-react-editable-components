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
import { MappedComponentProperties } from '../src/ComponentMapping';
import { EditConfig } from '../src/components/EditableComponent';
import {WrapAsAEMEditableComponent} from "../src/ComponentWrapper";
import ReactDOM from "react-dom";
import {WCMMode} from "../src/Utils";
import {Constants} from "../src/Constants";
import {ModelManager} from "@adobe/aem-spa-page-model-manager";
import { EditorContext, withEditorContext } from '../src/EditorContext';

describe('ComponentWrapper', () => {

    interface Props extends MappedComponentProperties {
        src?: string
    }

    const ROOT_CLASS_NAME = 'root-class';
    const COMPONENT_RESOURCE_TYPE = '/component/resource/type';
    const COMPONENT_PATH = '/path/to/component';
    const DATA_RESOURCE_TYPE_SELECTOR = '[' + Constants.DATA_CQ_RESOURCE_TYPE_ATTR + '="' + COMPONENT_RESOURCE_TYPE + '"]';

    const CQ_PROPS = {
        'cqPath': COMPONENT_PATH
    };
    const editConfig: EditConfig<Props> = {
        emptyLabel: 'Image',

        isEmpty() {
            return false;
        },

        aemResourceType: COMPONENT_RESOURCE_TYPE
    };

    let rootNode: any;

    class TestComponent extends Component<Props> {
        render () {
            return <div/>;
        }
    }

    let addListenerSpy: jest.SpyInstance;
    let getDataSpy: jest.SpyInstance;
    let initializeSpy: jest.SpyInstance;

    beforeEach(() => {

        addListenerSpy = jest.spyOn(ModelManager, 'addListener').mockImplementation();
        getDataSpy     = jest.spyOn(ModelManager, 'getData').mockResolvedValue({})
        initializeSpy  = jest.spyOn(ModelManager, 'initialize').mockResolvedValue({});

        rootNode = document.createElement('div');
        rootNode.className = ROOT_CLASS_NAME;
        document.body.appendChild(rootNode);
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'cq:wcmmode');
        meta.content = WCMMode.EDIT;
        document.head.appendChild(meta);
    });

    afterEach(() => {

        if (rootNode) {
            document.body.appendChild(rootNode);
            rootNode = undefined;
        }
    });

    it('should have data-cq-resource-type attribute set when using WrapAsAEMEditableComponent with config having aemResourceType and component virtual', () => {
        const WrappedTestComponent = WrapAsAEMEditableComponent(TestComponent, editConfig);

        expect(WrappedTestComponent).toBeDefined();

        ReactDOM.render(<EditorContext.Provider value={ true }><WrappedTestComponent virtual={true} {...CQ_PROPS}/></EditorContext.Provider>, rootNode);

        const node = rootNode.querySelector(DATA_RESOURCE_TYPE_SELECTOR);

        expect(node).not.toBeNull();
    });
});
