import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { ComponentMapping } from '../../src/ComponentMapping';
import { ModelManagerService } from '@adobe/cq-spa-page-model-manager';
import { Container } from '../../src/components/Container';

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
        "component1": {
            ":type": COMPONENT_TYPE1,
            "id": "c1"
        },
        "component2": {
            ":type": COMPONENT_TYPE2,
            "id": "c2"
        }
    };

    const ITEMS_ORDER = ['component1', 'component2'];

    class ComponentChild extends Component {

        render() {
            return <div id={this.props && this.props.id} className={ITEM_CLASS_NAME}/>;
        }
    }

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

    describe('childComponents ->', () => {

        it('should add the expected components', () => {
            ComponentMapping.get.returns(ComponentChild);

            ReactDOM.render(<Container componentMapping={ComponentMapping} cqItems={ITEMS} cqItemsOrder={ITEMS_ORDER}/>, rootNode);

            expect(ComponentMapping.get.calledWith(COMPONENT_TYPE1)).to.equal(true);
            expect(ComponentMapping.get.calledWith(COMPONENT_TYPE2)).to.equal(true);

            let childItem1 = rootNode.querySelector('#c1');
            let childItem2 = rootNode.querySelector('#c2');

            expect(childItem1).to.exist;
            expect(childItem2).to.exist;
        });

        it('should add a placeholder with data attribute when in WCM edit mode', () => {
            ReactDOM.render(<Container componentMapping={ComponentMapping} isInEditor={true} cqPath={CONTAINER_PATH}/>, rootNode);

            let containerPlaceholder = rootNode.querySelector(CONTAINER_PLACEHOLDER_DATA_ATTRIBUTE_SELECTOR + CONTAINER_PLACEHOLDER_SELECTOR);

            expect(containerPlaceholder).to.exist;
        });

        it('should not add a placeholder when not in WCM edit mode', () => {
            ReactDOM.render(<Container componentMapping={ComponentMapping}/>, rootNode);

            let containerPlaceholder = rootNode.querySelector(CONTAINER_PLACEHOLDER_SELECTOR);

            expect(containerPlaceholder).not.to.exist;
        });

        it('should add a data attribute on the children when in WCM edit mode', () => {
            ComponentMapping.get.returns(ComponentChild);

            ReactDOM.render(<Container componentMapping={ComponentMapping} isInEditor={true} cqPath={CONTAINER_PATH} cqItems={ITEMS} cqItemsOrder={ITEMS_ORDER}/>, rootNode);

            expect(ComponentMapping.get.calledWith(COMPONENT_TYPE1)).to.equal(true);
            expect(ComponentMapping.get.calledWith(COMPONENT_TYPE2)).to.equal(true);

            let containerPlaceholder = rootNode.querySelector(CONTAINER_PLACEHOLDER_SELECTOR);

            expect(containerPlaceholder).to.exist;

            let childItem1 = rootNode.querySelector(ITEM1_DATA_ATTRIBUTE_SELECTOR);
            let childItem2 = rootNode.querySelector(ITEM2_DATA_ATTRIBUTE_SELECTOR);

            expect(childItem1).to.exist;
            expect(childItem2).to.exist;
        });

    });

    describe('Data attributes ->', () => {

        it('should not add a the cq-data-path attribute if not in WCM edit mode', () => {
            ReactDOM.render(<Container componentMapping={ComponentMapping} cqPath={CONTAINER_PATH}/>, rootNode);

            let container = rootNode.querySelector('[data-cq-data-path="/container"]');

            expect(container).not.to.exist;
        });

        it('should add a the cq-data-path attribute if in WCM edit mode', () => {
            ReactDOM.render(<Container componentMapping={ComponentMapping} isInEditor={true} cqPath={CONTAINER_PATH}/>, rootNode);

            let container = rootNode.querySelector('[data-cq-data-path="/container"]');

            expect(container).to.exist;
        });

    });

});
