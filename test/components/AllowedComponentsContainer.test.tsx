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

import React from 'react';
import ReactDOM from 'react-dom';
import { AllowedComponents, AllowedComponentsContainer, AllowedComponentsProperties } from '../../src/components/allowedcomponents/AllowedComponentsContainer';
import { AllowedComponentPlaceholder } from '../../src/components/allowedcomponents/AllowedComponentsPlaceholder';
import { AllowedComponentPlaceholderList } from '../../src/components/allowedcomponents/AllowedComponentsPlaceholderList';
import { PlaceHolderModel } from '../../src/components/ContainerPlaceholder';

describe('AllowedComponentsContainer ->', () => {
    const ROOT_CLASS_NAME = 'root-class';
    const DEFAULT_TITLE = 'Layout Container';
    const DEFAULT_EMPTY_LABEL = 'Empty label tests';
    const ALLOWED_PLACEHOLDER_SELECTOR = '.aem-AllowedComponent--list';
    const ALLOWED_COMPONENT_TITLE_SELECTOR = '.aem-AllowedComponent--title';
    const ALLOWED_COMPONENT_PLACEHOLDER_SELECTOR = '.aem-AllowedComponent--component.cq-placeholder.placeholder';
    const COMPONENT_TEXT_PATH = '/content/page/jcr:content/root/text';
    const COMPONENT_TEXT_TITLE = 'Text';
    const COMPONENT_IMAGE_PATH = '/content/page/jcr:content/root/image';
    const COMPONENT_IMAGE_TITLE = 'Image';
    const CONTAINER_SELECTOR = '.aem-container';
    const CONTAINER_PLACEHOLDER_SELECTOR = '.new.section';

    const ALLOWED_COMPONENTS_EMPTY_DATA: AllowedComponents = {
        'applicable': true,
        'components': []
    };

    const ALLOWED_COMPONENTS_NOT_APPLICABLE_DATA: AllowedComponents = {
        'applicable': false,
        'components': []
    };

    const ALLOWED_COMPONENTS_DATA: AllowedComponents = {
        'applicable': true,
        'components': [
            {
                path: COMPONENT_TEXT_PATH,
                title: COMPONENT_TEXT_TITLE
            },
            {
                path: COMPONENT_IMAGE_PATH,
                title: COMPONENT_IMAGE_TITLE
            }
        ]
    };

    function generateAllowedComponentsContainer(allowedComponents: AllowedComponents, isInEditor: boolean, title?: string): JSX.Element {
        const props:AllowedComponentsProperties = {
            cqItems: {},
            cqItemsOrder: [],
            cqPath: '',
            isInEditor: isInEditor,
            title: title || '',
            allowedComponents: allowedComponents
        };

        return <AllowedComponentsContainer {...props}/>;
    }

    let rootNode: any;

    beforeEach(() => {
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

    describe('not applicable ->', () => {
        it('should NOT be applicable but have a default container placeholder', () => {
            ReactDOM.render(generateAllowedComponentsContainer(ALLOWED_COMPONENTS_NOT_APPLICABLE_DATA, true), rootNode);

            const allowedComponentsContainer = rootNode.querySelector(ALLOWED_PLACEHOLDER_SELECTOR);

            expect(allowedComponentsContainer).toBeNull();

            const container = rootNode.querySelector(CONTAINER_SELECTOR);

            expect(container).toBeDefined();

            const containerPlaceholder = container.querySelector(CONTAINER_PLACEHOLDER_SELECTOR);

            expect(containerPlaceholder).toBeDefined();
        });

    });

    describe('applicable ->', () => {

        it('should be applicable with an empty list of allowed components', () => {
            ReactDOM.render(generateAllowedComponentsContainer(ALLOWED_COMPONENTS_EMPTY_DATA, true), rootNode);

            const allowedComponentsContainer = rootNode.querySelector(ALLOWED_PLACEHOLDER_SELECTOR);

            expect(allowedComponentsContainer).toBeDefined();

            const allowedComponentsTitle = allowedComponentsContainer.querySelector(ALLOWED_COMPONENT_TITLE_SELECTOR);

            expect(allowedComponentsTitle).toBeDefined();
            expect(allowedComponentsTitle.dataset.text).toEqual('No allowed components');
            expect(allowedComponentsContainer.querySelector(ALLOWED_COMPONENT_PLACEHOLDER_SELECTOR)).toBeNull();
        });

        it('should be applicable with a list of allowed components', () => {

            ReactDOM.render(generateAllowedComponentsContainer(ALLOWED_COMPONENTS_DATA, true, DEFAULT_TITLE), rootNode);

            const allowedComponentsContainer = rootNode.querySelector(ALLOWED_PLACEHOLDER_SELECTOR);

            expect(allowedComponentsContainer).toBeDefined();

            const allowedComponentsTitle = allowedComponentsContainer.querySelector(ALLOWED_COMPONENT_TITLE_SELECTOR);

            expect(allowedComponentsTitle).toBeDefined();
            expect(allowedComponentsTitle.dataset.text).toEqual(DEFAULT_TITLE);
            expect(allowedComponentsContainer.querySelectorAll(ALLOWED_COMPONENT_PLACEHOLDER_SELECTOR).length).toEqual(2);
        });
    });

    describe('not in editor ->', () => {
        it('should be applicable with a list of allowed components but not in the editor', () => {
            ReactDOM.render(generateAllowedComponentsContainer(ALLOWED_COMPONENTS_DATA, false), rootNode);

            const allowedComponentsContainer = rootNode.querySelector(ALLOWED_PLACEHOLDER_SELECTOR);

            expect(allowedComponentsContainer).toBeNull();

            const container = rootNode.querySelector(CONTAINER_SELECTOR);

            expect(container).toBeDefined();

            const containerPlaceholder = container.querySelector(CONTAINER_PLACEHOLDER_SELECTOR);

            expect(containerPlaceholder).toBeNull();
        });
    });

    describe('AllowedComponentPlaceholderList ->', () => {
        it('should display two allowed components', () => {
            const placeHolderProperties:PlaceHolderModel = {
                placeholderClassNames: 'classNames',
                cqPath: '/some/path'
            };

            const element = <AllowedComponentPlaceholderList
                title={DEFAULT_TITLE}
                emptyLabel={DEFAULT_EMPTY_LABEL}
                components={ALLOWED_COMPONENTS_DATA.components}
                cqPath={'/some/path'} placeholderProps={placeHolderProperties}/>;

            ReactDOM.render(element, rootNode);

            const allowedComponentPlaceholderList = rootNode.querySelector(ALLOWED_PLACEHOLDER_SELECTOR);

            expect(allowedComponentPlaceholderList).toBeDefined();

            const allowedComponentsTitle = allowedComponentPlaceholderList.querySelector(ALLOWED_COMPONENT_TITLE_SELECTOR);

            expect(allowedComponentsTitle).toBeDefined();
            expect(allowedComponentsTitle.dataset.text).toEqual(DEFAULT_TITLE);
            expect(allowedComponentPlaceholderList.querySelectorAll(ALLOWED_COMPONENT_PLACEHOLDER_SELECTOR).length).toEqual(2);
        });
    });

    describe('AllowedComponentPlaceholder ->', () => {
        it('should display a path, emptyLabel and the expected class names', () => {
            ReactDOM.render(<AllowedComponentPlaceholder path={COMPONENT_TEXT_PATH} emptyLabel={COMPONENT_TEXT_TITLE} />, rootNode);

            const allowedComponentPlaceholder = rootNode.querySelector(ALLOWED_COMPONENT_PLACEHOLDER_SELECTOR);

            expect(allowedComponentPlaceholder).toBeDefined();
            expect(allowedComponentPlaceholder.dataset.emptytext).toEqual(COMPONENT_TEXT_TITLE);
            expect(allowedComponentPlaceholder.dataset.cqDataPath).toEqual(COMPONENT_TEXT_PATH);
        });
    });
});
