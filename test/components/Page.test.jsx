import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { ComponentMapping, ComponentMappingContext, withComponentMappingContext } from '../../src/ComponentMapping';
import { ModelManagerService } from '@adobe/cq-spa-page-model-manager';
import { Page } from '../../src/components/Page';
import { EditorContext, withEditorContext } from '../../src/EditorContext';
import { withEditable } from "../../src/components/EditableComponent";

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

    const CHILDREN = {
        "page1": {
            ":type": PAGE_TYPE1,
            "id": "p1",
            ":path": "child/page1"
        },
        "page2": {
            ":type": PAGE_TYPE2,
            "id": "p2",
            ":path": "child/page2"
        }
    };

    let rootNode;

    let sandbox = sinon.createSandbox();

    let EditorContextPage;

    class ChildComponent extends Component {
        render() {
            return <div id={this.props.id} className={CHILD_COMPONENT_CLASS_NAME}></div>
        }
    }

    beforeEach(() => {
        sandbox.stub(ComponentMapping, 'get');

        EditorContextPage = withComponentMappingContext(withEditorContext(Page));
        EditorContextPage.test = true;

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

    describe('child pages ->', () => {

        it('should add the expected children', () => {
            ComponentMapping.get.returns(ChildComponent);

            ReactDOM.render(<Page componentMapping={ComponentMapping} cqPath={PAGE_PATH} cqChildren={CHILDREN} cqItems={ITEMS} cqItemsOrder={ITEMS_ORDER}></Page>, rootNode);

            expect(ComponentMapping.get.calledWith(COMPONENT_TYPE1)).to.equal(true);
            expect(ComponentMapping.get.calledWith(COMPONENT_TYPE2)).to.equal(true);

            let childItem1 = rootNode.querySelector('#c1');
            let childItem2 = rootNode.querySelector('#c2');

            expect(childItem1).to.exist;
            expect(childItem2).to.exist;

            let childPage1 = rootNode.querySelector('#p1');
            let childPage2 = rootNode.querySelector('#p2');

            expect(childPage1).to.exist;
            expect(childPage2).to.exist;
        });

        it('should add the expected children with data attributes when in WCM edit mode', () => {
            let EditableChildComponent = withEditable(ChildComponent);
            ComponentMapping.get.withArgs(COMPONENT_TYPE1).returns(EditableChildComponent);
            ComponentMapping.get.withArgs(COMPONENT_TYPE2).returns(EditableChildComponent);
            ComponentMapping.get.withArgs(PAGE_TYPE1).returns(EditorContextPage);
            ComponentMapping.get.withArgs(PAGE_TYPE2).returns(EditorContextPage);

            ReactDOM.render(
                <EditorContext.Provider value={ true }>
                    <Page componentMapping={ComponentMapping} isInEditor={true} cqPath={PAGE_PATH} cqChildren={CHILDREN} cqItems={ITEMS} cqItemsOrder={ITEMS_ORDER}></Page>
                </EditorContext.Provider>, rootNode);

            expect(ComponentMapping.get.calledWith(COMPONENT_TYPE1)).to.equal(true);
            expect(ComponentMapping.get.calledWith(COMPONENT_TYPE2)).to.equal(true);

            let childItem1 = rootNode.querySelector(ITEM1_DATA_ATTRIBUTE_SELECTOR);
            let childItem2 = rootNode.querySelector(ITEM2_DATA_ATTRIBUTE_SELECTOR);

            expect(childItem1).to.exist;
            expect(childItem2).to.exist;

            let childPage1 = rootNode.querySelector(CHILD_PAGE_1_DATA_ATTRIBUTE_SELECTOR);
            let childPage2 = rootNode.querySelector(CHILD_PAGE_2_DATA_ATTRIBUTE_SELECTOR);

            expect(childPage1).to.exist;
            expect(childPage2).to.exist;
        });

    });
});
