import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { ModelProvider, withModel } from '../src/components/ModelProvider';
import { ModelManager } from '@adobe/cq-spa-page-model-manager';


describe('ModelProvider ->', () => {

    const TEST_PAGE_PATH = '/page/jcr:content/root';

    const STATIC_PAGE_MODEL_URL = '/content/react-page.json';

    const APP_MODEL_PATH = '/content/react-page';

    const CHILD_PAGE_PATH = '/content/react-page/page';

    const ROOT_NODE_CLASS_NAME = 'root-class';

    const ITEM_MODEL_0010 = {
        "cqType": "test/components/componentchild0",
        "value" : "value0010"
    };

    const ITEM_MODEL_0011 = {
        "cqType": "test/components/componentchild1",
        "value" : "value0011"
    };

    const ITEM_MODEL_0000 = {
        "gridClassNames": "aem-Grid aem-Grid--12 aem-Grid--default--12",
        "columnCount": 12,
        "cqItemsOrder": ["child0010", "child0011"],
        "cqItems": {
            "child0010": ITEM_MODEL_0010,
            "child0011": ITEM_MODEL_0011
        },
        "cqType": "wcm/foundation/components/responsivegrid"
    };

    const ITEM_MODEL_0001 = {
        "cqType": "test/components/componentchild1",
        "value" : "Value0012"
    };

    const ITEM_MODEL_ROUTE = {
        "gridClassNames": "aem-Grid aem-Grid--12 aem-Grid--default--12",
        "columnCount": 12,
        "cqItemsOrder": ["child0000", "child0001"],
        "cqItems": {
            "child0000": ITEM_MODEL_0000,
            "child0001": ITEM_MODEL_0001
        },
        "cqType": "wcm/foundation/components/responsivegrid"
    };

    const CHILD_PAGE_ITEM_MODEL_0101 = {
        "cqType": "wcm/foundation/components/image"
    };

    const CHILD_PAGE_MODEL = {
        "cqType": "we-retail-react/components/structure/page",
        "cqPath": CHILD_PAGE_PATH,
        "cqItemsOrder": ["child0101"],
        "cqHierarchyType": "page",
        "cqItems": {
            "child0101": CHILD_PAGE_ITEM_MODEL_0101
        }
    };

    const PAGE_MODEL = {
        "designPath": "/libs/settings/wcm/designs/default",
        "title": "React sample page",
        "lastModifiedDate": 1512116041058,
        "templateName": "sample-template",
        "cssClassNames": "page",
        "language": "en-US",
        "cqItemsOrder": [
            "root"
        ],
        "cqItems": {
            "root": ITEM_MODEL_ROUTE
        },
        "cqPath": APP_MODEL_PATH,
        "cqHierarchyType": "page",
        "cqChildren": {
            "/content/react-page/page": CHILD_PAGE_MODEL
        },
        "cqType": "we-retail-react/components/structure/page"
    };

    const INNER_COMPONENT_ID = 'innerContent';

    let rootNode;

    let observer;

    let sandbox = sinon.createSandbox();

    /**
     * React warn if a non-standard DOM attribute is used on a native DOM node.
     *
     * When the HTML div element is wrapped to be a React Component it is no longer a DOM node and camelCase properties
     * can be passed to props.
     *
     * If instead of the <ModelProvider><Dummy /></ModelProvider> the <ModelProvider><div /></ModelProvider> notation
     * is used, the following error might be shown in the browser console:
     *
     *      Warning: React does not recognize the `camelCaseProp` prop on a DOM element. If you intentionally want it to
     *      appear in the DOM as a custom attribute, spell it as lowercase `camelcaseprop` instead. If you accidentally
     *      passed it from a parent component, remove it from the DOM element.
     *          in div (created by ModelProvider)
     *          in ModelProvider
     *
     * for every camelCase property passed in props.
     *
     * See also: https://github.com/facebook/react/issues/10590
     */
    class Dummy extends Component {
        render() {
            return <div id={INNER_COMPONENT_ID} className={this.props.className}>Dummy</div>;
        }
    }

    beforeEach(() => {
        sandbox.stub(ModelManager, 'addListener');
        sandbox.stub(ModelManager, 'getData');

        sandbox.stub(ModelManager, 'initialize').withArgs(STATIC_PAGE_MODEL_URL).resolves(PAGE_MODEL);

        rootNode = document.createElement('div');
        rootNode.className = ROOT_NODE_CLASS_NAME;
        document.body.appendChild(rootNode);
    });

    afterEach(() => {
        if (observer) {
            observer.disconnect();
        }

        sandbox.restore();

        if (rootNode) {
            document.body.removeChild(rootNode);
        }
    });

    describe('Tag instantiation ->', () => {

        it('should initialize properly without parameter', () => {
            ReactDOM.render(<ModelProvider wrappedComponent={Dummy}></ModelProvider>, rootNode);

            expect(ModelManager.addListener.calledWith(undefined, sinon.match.func)).to.equal(true);

            let childNode = rootNode.querySelector('#' + INNER_COMPONENT_ID);

            expect(childNode).to.exist;
        });

        it('should initialize properly with a path parameter', () => {
            ReactDOM.render(<ModelProvider cqPath={TEST_PAGE_PATH} wrappedComponent={Dummy}></ModelProvider>, rootNode);

            expect(ModelManager.addListener.calledWith(TEST_PAGE_PATH, sinon.match.func)).to.equal(true);

            let childNode = rootNode.querySelector('#' + INNER_COMPONENT_ID);

            expect(childNode).to.exist;
        });
    });

    describe('Get data ->', () => {

        it('should request the data with undefined parameters', () => {
            ModelManager.addListener.callsArg(1);
            ModelManager.getData.resolves({});

            ReactDOM.render(<ModelProvider wrappedComponent={Dummy}></ModelProvider>, rootNode);

            expect(ModelManager.getData.calledWith({path: undefined, forceReload: undefined})).to.equal(true);
        });

        it('should request the data with the provided attributes', () => {
            ModelManager.addListener.callsArg(1);
            ModelManager.getData.resolves({});

            ReactDOM.render(<ModelProvider cqPath={TEST_PAGE_PATH} cqForceReload={true} wrappedComponent={Dummy}></ModelProvider>, rootNode);

            expect(ModelManager.getData.calledWith({path: TEST_PAGE_PATH, forceReload: true})).to.equal(true);
        });
    });

    describe('withModel ->', () => {

        it('should initialize properly without parameter', () => {
            let DummyWithModel = withModel(Dummy);
            ReactDOM.render(<DummyWithModel></DummyWithModel>, rootNode);

            expect(ModelManager.addListener.calledWith(undefined, sinon.match.func)).to.equal(true);

            let childNode = rootNode.querySelector('#' + INNER_COMPONENT_ID);

            expect(childNode).to.exist;
        });

        it('should initialize properly with a path parameter', () => {
            let DummyWithModel = withModel(Dummy);
            ReactDOM.render(<DummyWithModel cqPath={TEST_PAGE_PATH}></DummyWithModel>, rootNode);

            expect(ModelManager.addListener.calledWith(TEST_PAGE_PATH, sinon.match.func)).to.equal(true);

            let childNode = rootNode.querySelector('#' + INNER_COMPONENT_ID);

            expect(childNode).to.exist;
        });
    });

});
