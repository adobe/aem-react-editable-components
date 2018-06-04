import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {getDataAttributesObserver} from './Utils';
import { ModelProvider, PageModelManager, MapTo, withModel } from '../index';


describe('ModelProvider ->', () => {

    const STATIC_PAGE_MODEL_URL = '/content/react-page.json';

    const SITE_MODEL_PATH = '/content/react-page';

    const CHILD_PAGE_PATH = '/content/react-page/page';

    const CHILD10_PATH = 'root/child0000/child0010';

    const CHILD11_PATH = 'root/child0000/child0011';

    const CHILD_PAGE_ITEM_MODEL_0101_PATH = 'child0101';

    const NO_VALUE = 'none';

    const DATA_ATTRIBUTE_DATA_PATH = 'data-cq-data-path';

    const DATA_ATTRIBUTE_PAGE_PATH = 'data-cq-page-path';

    const TEST_COMPONENT_RESOURCE_TYPE = 'test/component/resource/type';

    const ROOT_NODE_CLASS_NAME = 'root-class';

    const ITEM_MODEL_0010 = {
        ":type": "test/components/componentchild0",
        "value" : "value0010"
    };

    const ITEM_MODEL_0011 = {
        ":type": "test/components/componentchild1",
        "value" : "value0011"
    };

    const ITEM_MODEL_0000 = {
        "gridClassNames": "aem-Grid aem-Grid--12 aem-Grid--default--12",
        "columnCount": 12,
        ":itemsOrder": ["child0010", "child0011"],
        ":items": {
            "child0010": ITEM_MODEL_0010,
            "child0011": ITEM_MODEL_0011
        },
        ":type": "wcm/foundation/components/responsivegrid"
    };

    const ITEM_MODEL_0001 = {
        ":type": "test/components/componentchild1",
        "value" : "Value0012"
    };

    const ITEM_MODEL_ROUTE = {
        "gridClassNames": "aem-Grid aem-Grid--12 aem-Grid--default--12",
        "columnCount": 12,
        ":itemsOrder": ["child0000", "child0001"],
        ":items": {
            "child0000": ITEM_MODEL_0000,
            "child0001": ITEM_MODEL_0001
        },
        ":type": "wcm/foundation/components/responsivegrid"
    };

    const CHILD_PAGE_ITEM_MODEL_0101 = {
        ":type": "wcm/foundation/components/image"
    };

    const CHILD_PAGE_MODEL = {
        ":type": "we-retail-react/components/structure/page",
        ":path": CHILD_PAGE_PATH,
        "itemsOrder": ["child0101"],
        ":hierarchyType": "page",
        "items": {
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
        ":itemsOrder": [
            "root"
        ],
        ":items": {
            "root": ITEM_MODEL_ROUTE
        },
        ":path": SITE_MODEL_PATH,
        ":hierarchyType": "page",
        ":children": {
            "/content/react-page/page": CHILD_PAGE_MODEL
        },
        ":type": "we-retail-react/components/structure/page"
    };

    const INNER_COMPONENT_ID = 'innerContent';

    let rootNode;

    let observer;

    let observerConfig = { attributes: true, subtree: true };

    let sandbox = sinon.createSandbox();

    const EditConfig = {

        /**
         * @inheritDoc
         */
        dragDropName: 'image',

        /**
         * @inheritDoc
         */
        emptyLabel: 'Image',

        /**
         * @inheritDoc
         */
        isEmpty: function() {
            return !this.props || !this.props.cqModel || !this.props.cqModel.src || this.props.cqModel.src.trim().length < 1;
        }
    };

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
            return <div id={INNER_COMPONENT_ID}>Abc</div>;
        }
    }
    class TestComponent extends Component {
        render () {
            let value = NO_VALUE;

            if (this.props.cqModel) {
                value = this.props.cqModel.value || NO_VALUE;
            }

            return <div id={INNER_COMPONENT_ID} data-value={value}/>;
        }
    }

    beforeEach(() => {
        sandbox.stub(PageModelManager, 'getData')
            .withArgs({pagePath: '', dataPath: '', forceReload: undefined}).resolves(PAGE_MODEL)
            .withArgs({pagePath: '', dataPath: 'root', forceReload: undefined}).resolves(ITEM_MODEL_ROUTE)
            .withArgs({pagePath: '', dataPath: CHILD10_PATH, forceReload: undefined}).resolves(ITEM_MODEL_0010)
            .withArgs({pagePath: '', dataPath: CHILD11_PATH, forceReload: undefined}).resolves(ITEM_MODEL_0011)
            .withArgs({pagePath: CHILD_PAGE_PATH, dataPath: '', forceReload: undefined}).resolves(CHILD_PAGE_MODEL)
            .withArgs({pagePath: CHILD_PAGE_PATH, dataPath: '', forceReload: true}).resolves(CHILD_PAGE_MODEL)
            .withArgs({pagePath: CHILD_PAGE_PATH, dataPath: CHILD_PAGE_ITEM_MODEL_0101_PATH, forceReload: undefined}).resolves(CHILD_PAGE_ITEM_MODEL_0101)
            .withArgs({pagePath: CHILD_PAGE_PATH, dataPath: CHILD_PAGE_ITEM_MODEL_0101_PATH, forceReload: true}).resolves(CHILD_PAGE_ITEM_MODEL_0101);

        sandbox.stub(PageModelManager, 'init').withArgs(STATIC_PAGE_MODEL_URL).resolves(PAGE_MODEL);

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

        it('should initialize properly without parameter', done => {
            ReactDOM.render(<ModelProvider><Dummy /></ModelProvider>, rootNode);

            observer = getDataAttributesObserver({[DATA_ATTRIBUTE_PAGE_PATH]: SITE_MODEL_PATH, [DATA_ATTRIBUTE_DATA_PATH]: undefined}, undefined, done);
            observer.observe(rootNode, observerConfig);
        });

        it('should initialize properly with a path parameter', done => {
            const path = 'root';

            ReactDOM.render(<ModelProvider dataPath={path}><Dummy /></ModelProvider>, rootNode);

            // Expect {path}.
            observer = getDataAttributesObserver({[DATA_ATTRIBUTE_DATA_PATH]: path}, undefined, done);
            observer.observe(rootNode, observerConfig);
        });

        it('should initialize properly with a key parameter', done => {
            ReactDOM.render(<ModelProvider key={'test'}><Dummy /></ModelProvider>, rootNode);

            // Expect empty path.
            observer = getDataAttributesObserver({[DATA_ATTRIBUTE_DATA_PATH]: undefined}, undefined, done);
            observer.observe(rootNode, observerConfig);
        });

        it('should initialize properly with a path and a key parameter', done => {
            const path = 'root';

            ReactDOM.render(<ModelProvider key={'test'} dataPath={path}><Dummy /></ModelProvider>, rootNode);

            // Expect {path}.
            observer = getDataAttributesObserver({[DATA_ATTRIBUTE_DATA_PATH]: path}, undefined, done);
            observer.observe(rootNode, observerConfig);
        });

        it('should request the model for a page', done => {
            ReactDOM.render(<ModelProvider key={'test'} pagePath={CHILD_PAGE_PATH}><Dummy /></ModelProvider>, rootNode);

            // Expect {path}.
            observer = getDataAttributesObserver({[DATA_ATTRIBUTE_PAGE_PATH]: CHILD_PAGE_PATH}, undefined, done);
            observer.observe(rootNode, observerConfig);
        });

        it('should request the model for an item in a page', done => {
            ReactDOM.render(<ModelProvider key={'test'} pagePath={CHILD_PAGE_PATH} dataPath={CHILD_PAGE_ITEM_MODEL_0101_PATH}><Dummy /></ModelProvider>, rootNode);

            // Expect {path}.
            observer = getDataAttributesObserver({[DATA_ATTRIBUTE_PAGE_PATH]: undefined, [DATA_ATTRIBUTE_DATA_PATH]: CHILD_PAGE_ITEM_MODEL_0101_PATH}, undefined, done);
            observer.observe(rootNode, observerConfig);
        });

        it('should force reload the model', done => {
            ReactDOM.render(<ModelProvider key={'test'} pagePath={CHILD_PAGE_PATH} dataPath={CHILD_PAGE_ITEM_MODEL_0101_PATH} forceReload={true}><Dummy /></ModelProvider>, rootNode);

            if (!PageModelManager.getData.calledWithExactly({pagePath: CHILD_PAGE_PATH, dataPath: CHILD_PAGE_ITEM_MODEL_0101_PATH, forceReload: true})) {
                done(new Error('force load not enabled'));
                return;
            }

            done();
        });

        it('should get a piece of model in a child page - configured via withModel', done => {
            class TestComponent extends Component {
                render () {
                    return <div className={'test-component-class'}/>;
                }
            }

            const ModelTestComponent = withModel(TestComponent);

            ReactDOM.render(<ModelTestComponent cqModelPagePath={CHILD_PAGE_PATH} cqModelDataPath={CHILD_PAGE_ITEM_MODEL_0101_PATH}/>, rootNode);

            if (!PageModelManager.getData.calledWithExactly({pagePath: CHILD_PAGE_PATH, dataPath: CHILD_PAGE_ITEM_MODEL_0101_PATH, forceReload: undefined})) {
                done(new Error('force load not enabled'));
                return;
            }

            done();
        });

        it('should force reload the model in conjunction withModel using function parameter', done => {
            class TestComponent extends Component {
                render () {
                    return <div className={'test-component-class'}/>;
                }
            }

            const ModelTestComponent = withModel(TestComponent, {forceReload: true});

            ReactDOM.render(<ModelTestComponent cqModelPagePath={CHILD_PAGE_PATH} cqModelDataPath={CHILD_PAGE_ITEM_MODEL_0101_PATH}/>, rootNode);

            if (!PageModelManager.getData.calledWithExactly({pagePath: CHILD_PAGE_PATH, dataPath: CHILD_PAGE_ITEM_MODEL_0101_PATH, forceReload: true})) {
                done(new Error('force load not enabled'));
                return;
            }

            done();
        });

        it('should force reload the model in conjunction withModel using the tag attribute', done => {
            class TestComponent extends Component {
                render () {
                    return <div className={'test-component-class'}/>;
                }
            }

            const ModelTestComponent = withModel(TestComponent);

            ReactDOM.render(<ModelTestComponent cqModelPagePath={CHILD_PAGE_PATH} cqModelDataPath={CHILD_PAGE_ITEM_MODEL_0101_PATH} cqModelForceReload={true}/>, rootNode);

            if (!PageModelManager.getData.calledWithExactly({pagePath: CHILD_PAGE_PATH, dataPath: CHILD_PAGE_ITEM_MODEL_0101_PATH, forceReload: true})) {
                done(new Error('force load not enabled'));
                return;
            }

            done();
        });
    });

    describe('decoration ->', () => {

        it('should decorate the inner content', done => {
            let config = { attributes: true, subtree: true, childList: true };

            let instance = ReactDOM.render(
                <ModelProvider dataPath={CHILD10_PATH}>
                    <Dummy />
                </ModelProvider>, rootNode);

            observer = getDataAttributesObserver({[DATA_ATTRIBUTE_DATA_PATH]: CHILD10_PATH}, '#' + INNER_COMPONENT_ID, done);
            observer.observe(rootNode, config);

            expect(instance.props.dataPath).to.equal(CHILD10_PATH);
        });

        it('should return a component wrapped in a model provider', done => {
            const ModelWrappedComponent = withModel(TestComponent);

            let config = { attributes: true, subtree: true, childList: true };

            ReactDOM.render(<ModelWrappedComponent cqModelDataPath={CHILD10_PATH}/>, rootNode);

            // Expect child10 path & value.
            observer = getDataAttributesObserver({[DATA_ATTRIBUTE_DATA_PATH]: CHILD10_PATH}, '#' + INNER_COMPONENT_ID, step2);
            observer.observe(rootNode, config);

            function step2() {
                observer.disconnect();
                // Produce an update instead of a replacement
                ReactDOM.render(<ModelWrappedComponent now={Date.now()}/>, rootNode);

                // Path prop removed - Expect no path and no value.
                observer = getDataAttributesObserver({[DATA_ATTRIBUTE_DATA_PATH]: undefined}, '#' + INNER_COMPONENT_ID, done);
                observer.observe(rootNode, config);
            }
        });

        it('should return a component wrapped in a model provider using the MapTo function', done => {
            let config = { attributes: true, subtree: true, childList: true };

            const ExportedTestComponent = MapTo(TEST_COMPONENT_RESOURCE_TYPE)(TestComponent, EditConfig);

            ReactDOM.render(<ExportedTestComponent cqModelDataPath={CHILD10_PATH}/>, rootNode);

            // Expect child10 path & value.
            observer = getDataAttributesObserver({[DATA_ATTRIBUTE_DATA_PATH]: CHILD10_PATH}, '#' + INNER_COMPONENT_ID, step2);
            observer.observe(rootNode, config);

            function step2() {
                observer.disconnect();
                // Produce an update instead of a replacement
                ReactDOM.render(<ExportedTestComponent now={Date.now()}/>, rootNode);

                // Path prop removed - Expect no path and no value.
                observer = getDataAttributesObserver({[DATA_ATTRIBUTE_DATA_PATH]: undefined}, '#' + INNER_COMPONENT_ID, done);
                observer.observe(rootNode, config);
            }
        });

        it('should update value when path changes', done => {
            let config = { attributes: true, subtree: true, childList: true };

            const ExportedTestComponent = MapTo(TEST_COMPONENT_RESOURCE_TYPE)(TestComponent, EditConfig);

            ReactDOM.render(<ExportedTestComponent cqModelDataPath={CHILD10_PATH}/>, rootNode);

            // Expect child10 path & value.
            observer = getDataAttributesObserver({[DATA_ATTRIBUTE_DATA_PATH]: CHILD10_PATH}, '#' + INNER_COMPONENT_ID, step2);
            observer.observe(rootNode, config);

            function step2() {
                observer.disconnect();
                ReactDOM.render(<ExportedTestComponent cqModelDataPath={CHILD11_PATH}/>, rootNode);

                // Expect child11 path & value.
                observer = getDataAttributesObserver({[DATA_ATTRIBUTE_DATA_PATH]: CHILD11_PATH}, '#' + INNER_COMPONENT_ID, done);
                observer.observe(rootNode, config);
            }
        });

    });

});