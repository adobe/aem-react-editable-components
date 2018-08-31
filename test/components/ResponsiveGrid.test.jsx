import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { ComponentMapping } from '@adobe/cq-spa-component-mapping';
import { ModelManagerService } from '@adobe/cq-spa-page-model-manager';
import { ResponsiveGrid } from '../../src/components/ResponsiveGrid';

describe('ResponsiveGrid ->', () => {

    const CONTAINER_PLACEHOLDER_SELECTOR = '.new.section';
    const CONTAINER_PLACEHOLDER_DATA_ATTRIBUTE_SELECTOR = '[data-cq-data-path="/container/*"]';
    const ROOT_CLASS_NAME = 'root-class';
    const ITEM_CLASS_NAME = 'item-class';
    const CONTAINER_PATH = '/container';
    const ITEM1_DATA_ATTRIBUTE_SELECTOR = '[data-cq-data-path="/container/component1"]';
    const ITEM2_DATA_ATTRIBUTE_SELECTOR = '[data-cq-data-path="/container/component2"]';
    const GRID_CLASS_NAMES = 'grid-class-names';
    const COLUMN_1_CLASS_NAMES = 'column-class-names-1';
    const COLUMN_2_CLASS_NAMES = 'column-class-names-2';
    const PLACEHOLDER_CLASS_NAMES = 'aem-Grid-newComponent';

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

    const COLUMN_CLASS_NAMES = {
        'component1': COLUMN_1_CLASS_NAMES,
        'component2': COLUMN_2_CLASS_NAMES
    };

    class ComponentChild extends Component {

        render() {
            return <div id={this.props && this.props.id} className={ITEM_CLASS_NAME}></div>;
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

    describe('Grid class names ->', () => {

        it('should add the grid class names', () => {
            ReactDOM.render(<ResponsiveGrid gridClassNames={GRID_CLASS_NAMES}></ResponsiveGrid>, rootNode);

            let gridElement = rootNode.querySelector('.' + GRID_CLASS_NAMES);

            expect(gridElement).to.exist;
        });

    });

    describe('Placeholder ->', () => {

        it('should add the expected placeholder class names', () => {
            ReactDOM.render(<ResponsiveGrid isInEditor={true} cqPath={CONTAINER_PATH} gridClassNames={GRID_CLASS_NAMES}></ResponsiveGrid>, rootNode);

            let gridPlaceholder = rootNode.querySelector('.' + PLACEHOLDER_CLASS_NAMES + CONTAINER_PLACEHOLDER_SELECTOR + CONTAINER_PLACEHOLDER_DATA_ATTRIBUTE_SELECTOR);

            expect(gridPlaceholder).to.exist;
        });

    });

    describe('Column class names ->', () => {

        it('should add the expected column class names', () => {
            ComponentMapping.get.returns(ComponentChild);

            ReactDOM.render(<ResponsiveGrid isInEditor={true} columnClassNames={COLUMN_CLASS_NAMES} cqPath={CONTAINER_PATH} cqItems={ITEMS} cqItemsOrder={ITEMS_ORDER} gridClassNames={GRID_CLASS_NAMES}></ResponsiveGrid>, rootNode);

            let childItem1 = rootNode.querySelector('.' + COLUMN_1_CLASS_NAMES + ITEM1_DATA_ATTRIBUTE_SELECTOR);
            let childItem2 = rootNode.querySelector('.' + COLUMN_2_CLASS_NAMES + ITEM2_DATA_ATTRIBUTE_SELECTOR);

            expect(childItem1).to.exist;
            expect(childItem2).to.exist;
        });

    });

});
