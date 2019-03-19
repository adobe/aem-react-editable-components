import React from 'react';
import ReactDOM from 'react-dom';
import { ComponentMapping } from '../../src/ComponentMapping';
import {
    AllowedComponentPlaceholder,
    AllowedComponentPlaceholderList,
    AllowedComponentsContainer
} from '../../src/components/AllowedComponentsContainer';

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
    const CONTAINER_SELECTOR = ".aem-container";
    const CONTAINER_PLACEHOLDER_SELECTOR = ".new.section";

    const ALLOWED_COMPONENTS_EMPTY_DATA = {
        "applicable": true,
        "components": []
    };

    const ALLOWED_COMPONENTS_NOT_APPLICABLE_DATA = {
        "applicable": false,
        "components": []
    };

    const ALLOWED_COMPONENTS_DATA = {
        "applicable": true,
        "components": [
            {
                path: COMPONENT_TEXT_PATH,
                title: COMPONENT_TEXT_TITLE
            },{
                path: COMPONENT_IMAGE_PATH,
                title: COMPONENT_IMAGE_TITLE
            }
        ]
    };

    let rootNode;

    let sandbox = sinon.createSandbox();

    beforeEach(() => {
        sandbox.stub(ComponentMapping, 'get');

        rootNode = document.createElement('div');
        rootNode.className = ROOT_CLASS_NAME;
        document.body.appendChild(rootNode);
    });

    afterEach(() => {
        sandbox.restore();

        if (rootNode) {
            document.body.appendChild(rootNode);
            rootNode = undefined;
        }
    });

    describe('not applicable ->', () => {

        it('should NOT be applicable but have a default container placeholder', () => {
            ReactDOM.render(<AllowedComponentsContainer allowedComponents={ALLOWED_COMPONENTS_NOT_APPLICABLE_DATA} isInEditor={true} />, rootNode);

            let allowedComponentsContainer = rootNode.querySelector(ALLOWED_PLACEHOLDER_SELECTOR);

            expect(allowedComponentsContainer).not.to.exist;

            let container = rootNode.querySelector(CONTAINER_SELECTOR);

            expect(container).to.exist;

            let containerPlaceholder = container.querySelector(CONTAINER_PLACEHOLDER_SELECTOR);

            expect(containerPlaceholder).to.exist;
        });

    });

    describe('applicable ->', () => {

        it('should be applicable with an empty list of allowed components', () => {
            ReactDOM.render(<AllowedComponentsContainer allowedComponents={ALLOWED_COMPONENTS_EMPTY_DATA} isInEditor={true} />, rootNode);

            let allowedComponentsContainer = rootNode.querySelector(ALLOWED_PLACEHOLDER_SELECTOR);

            expect(allowedComponentsContainer).to.exist;

            let allowedComponentsTitle = allowedComponentsContainer.querySelector(ALLOWED_COMPONENT_TITLE_SELECTOR);

            expect(allowedComponentsTitle).to.exist;
            expect(allowedComponentsTitle.dataset.text).to.equal('No allowed components');
            expect(allowedComponentsContainer.querySelector(ALLOWED_COMPONENT_PLACEHOLDER_SELECTOR)).to.equal(null);
        });

        it('should be applicable with a list of allowed components', () => {
            ReactDOM.render(<AllowedComponentsContainer allowedComponents={ALLOWED_COMPONENTS_DATA} title={DEFAULT_TITLE} isInEditor={true} />, rootNode);

            let allowedComponentsContainer = rootNode.querySelector(ALLOWED_PLACEHOLDER_SELECTOR);

            expect(allowedComponentsContainer).to.exist;

            let allowedComponentsTitle = allowedComponentsContainer.querySelector(ALLOWED_COMPONENT_TITLE_SELECTOR);

            expect(allowedComponentsTitle).to.exist;
            expect(allowedComponentsTitle.dataset.text).to.equal(DEFAULT_TITLE);

            expect(allowedComponentsContainer.querySelectorAll(ALLOWED_COMPONENT_PLACEHOLDER_SELECTOR).length).to.equal(2);
        });

    });

    describe('not in editor ->', () => {

        it('should be applicable with a list of allowed components but not in the editor', () => {
            ReactDOM.render(<AllowedComponentsContainer allowedComponents={ALLOWED_COMPONENTS_DATA} isInEditor={false} />, rootNode);

            let allowedComponentsContainer = rootNode.querySelector(ALLOWED_PLACEHOLDER_SELECTOR);

            expect(allowedComponentsContainer).not.to.exist;

            let container = rootNode.querySelector(CONTAINER_SELECTOR);

            expect(container).to.exist;

            let containerPlaceholder = container.querySelector(CONTAINER_PLACEHOLDER_SELECTOR);

            expect(containerPlaceholder).not.to.exist;
        });

    });

    describe('AllowedComponentPlaceholderList ->', () => {

        it('should display two allowed components', () => {
            ReactDOM.render(<AllowedComponentPlaceholderList title={DEFAULT_TITLE}
                                                             emptyLabel={DEFAULT_EMPTY_LABEL}
                                                             components={ALLOWED_COMPONENTS_DATA.components} />, rootNode);

            let allowedComponentPlaceholderList = rootNode.querySelector(ALLOWED_PLACEHOLDER_SELECTOR);

            expect(allowedComponentPlaceholderList).to.exist;

            let allowedComponentsTitle = allowedComponentPlaceholderList.querySelector(ALLOWED_COMPONENT_TITLE_SELECTOR);

            expect(allowedComponentsTitle).to.exist;
            expect(allowedComponentsTitle.dataset.text).to.equal(DEFAULT_TITLE);

            expect(allowedComponentPlaceholderList.querySelectorAll(ALLOWED_COMPONENT_PLACEHOLDER_SELECTOR).length).to.equal(2);
        });

    });

    describe('AllowedComponentPlaceholder ->', () => {

        it('should display a path, emptyLabel and the expected class names', () => {
            ReactDOM.render(<AllowedComponentPlaceholder path={COMPONENT_TEXT_PATH} emptyLabel={COMPONENT_TEXT_TITLE} />, rootNode);

            let allowedComponentPlaceholder = rootNode.querySelector(ALLOWED_COMPONENT_PLACEHOLDER_SELECTOR);

            expect(allowedComponentPlaceholder).to.exist;
            expect(allowedComponentPlaceholder.dataset.emptytext).to.equal(COMPONENT_TEXT_TITLE);
            expect(allowedComponentPlaceholder.dataset.cqDataPath).to.equal(COMPONENT_TEXT_PATH);
        });

    });

});
