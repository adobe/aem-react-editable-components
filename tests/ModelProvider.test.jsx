import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { ModelProvider, PageModelManager, MapTo, withModel } from '../index';


describe('ModelProvider', () => {

    const STATIC_PAGE_MODEL = 'react-page.json';

    const ROOT_GRID_CLASS_PATH = 'root';

    const CHILD10_PATH = 'root/child0000/child0010';

    const CHILD11_PATH = 'root/child0000/child0011';

    const NO_VALUE = 'none';

    const CHILD10_VALUE = 'value0010';

    const CHILD11_VALUE = 'value0011';

    const DATA_ATTRIBUTE_VALUE = 'data-value';

    const DATA_ATTRIBUTE_CONTENT_PATH = 'data-cq-content-path';

    const TEST_COMPONENT_RESOURCE_TYPE = 'test/component/resource/type';

    const PAGE_MODEL_JSON = {
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
            "root": {
                "gridClassNames": "aem-Grid aem-Grid--12 aem-Grid--default--12",
                "columnCount": 12,
                ":itemsOrder": ["child0000", "child0001"],
                ":items": {
                    "child0000": {
                        "gridClassNames": "aem-Grid aem-Grid--12 aem-Grid--default--12",
                        "columnCount": 12,
                        ":itemsOrder": ["child0010", "child0011"],
                        ":items": {
                            "child0010": {":type": "test/components/componentchild0", "value" : "value0010"},
                            "child0011": {":type": "test/components/componentchild1", "value" : "value0011"}
                        },
                        ":type": "wcm/foundation/components/responsivegrid"
                    },
                    "child0001": {":type": "test/components/componentchild1", "value" : "Value0012"}
                },
                ":type": "wcm/foundation/components/responsivegrid"
            }
        },
        ":type": "we-retail-react/components/structure/page"
    };

    const INNER_COMPONENT_ID = 'innerContent';

    let server;

    let rootNode;

    let observer;

    let observerConfig = { attributes: true, subtree: true };

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
            return !this.props || !this.props.cq_model || !this.props.cq_model.src || this.props.cq_model.src.trim().length < 1;
        }
    };

    class TestComponent extends Component {
        render () {
            let value = NO_VALUE;

            if (this.props.cq_model) {
                value = this.props.cq_model.value || NO_VALUE;
            }

            return <div id={INNER_COMPONENT_ID} data-value={value}/>;
        }
    }

    /**
     * Generic observe function
     *
     * @param {function} process    - function in charge of providing an object to the verify function
     * @param {function} verify     - function which verify the processed object
     * @param {function} done       - Mocha asynchronous function
     * @returns {Function}
     */
    function observe(process, verify, done) {
        return function (mutationsList) {
            let result = {};

            for (let mutation of mutationsList) {
                process(mutation,result);
            }

            verify(result);
            done();
        }
    }

    beforeEach(() => {
        server = sinon.fakeServer.create();

        server.respondWith("GET", STATIC_PAGE_MODEL,
            [200, { "Content-Type": "application/json" }, JSON.stringify(PAGE_MODEL_JSON)]);

        PageModelManager.init(STATIC_PAGE_MODEL).then(model => {
            assert.deepEqual(PAGE_MODEL_JSON, model, 'Returns the page model object');
        });

        rootNode = document.createElement('div');

        server.respond();
    });

    afterEach(() => {
        if (observer) {
            observer.disconnect();
        }

        server.restore();
        rootNode.innerHTML = '';
    });

    function getContentPathObserver(path, done, id) {
        return new MutationObserver(observe(
            function (mutation, result) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-cq-content-path') {
                    if (!id || mutation.target.id === id) {
                        result.cqContentPath = mutation.target.dataset.cqContentPath;
                    }
                }
            },
            function (result) {
                expect(result.cqContentPath).to.equal(path);
            }, done));
    }

    function getContentPathAndValueObserver(path, value, id, done) {
        return new MutationObserver(observe(
            function (mutation, result) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-cq-content-path' && mutation.target.id === id) {
                    if (value) {
                        result.value = mutation.target.getAttribute(DATA_ATTRIBUTE_VALUE);
                    }

                    result.cqContentPath = mutation.target.dataset.cqContentPath;
                }
            },
            function (result) {
                expect(result.cqContentPath).to.equal(path);

                if (value) {
                    expect(result.value).to.equal(value);
                }
            }, done));
    }

    describe('Tag instantiation ->', () => {

        it('should initialize properly without parameter', done => {
            ReactDOM.render(<ModelProvider><div></div></ModelProvider>, rootNode);

            // Expect an empty path.
            observer = getContentPathObserver("", done);
            observer.observe(rootNode, observerConfig);
        });

        it('should initialize properly with a path parameter', done => {
            const path = 'root';

            ReactDOM.render(<ModelProvider path={path}><div></div></ModelProvider>, rootNode);

            // Expect {path}.
            observer = getContentPathObserver(path, done);
            observer.observe(rootNode, observerConfig);
        });

        it('should initialize properly with a key parameter', done => {
            ReactDOM.render(<ModelProvider key={'test'}><div></div></ModelProvider>, rootNode);

            // Expect empty path.
            observer = getContentPathObserver('', done);
            observer.observe(rootNode, observerConfig);
        });

        it('should initialize properly with a path and a key parameter', done => {
            const path = 'root';

            ReactDOM.render(<ModelProvider key={'test'} path={path}><div></div></ModelProvider>, rootNode);

            // Expect {path}.
            observer = getContentPathObserver(path, done);
            observer.observe(rootNode, observerConfig);
        });
    });

    describe('decoration ->', () => {

        it('should decorate the inner content', done => {
            let config = { attributes: true, subtree: true, childList: true };

            let instance = ReactDOM.render(
                <ModelProvider path={CHILD10_PATH}>
                    <div id={INNER_COMPONENT_ID}/>
                </ModelProvider>, rootNode);

            observer = getContentPathObserver(CHILD10_PATH, done, INNER_COMPONENT_ID);
            observer.observe(rootNode, config);

            expect(instance.props.path).to.equal(CHILD10_PATH);
        });

        it('should return a component wrapped in a model provider', done => {
            const ModelWrappedComponent = withModel(TestComponent);

            let config = { attributes: true, subtree: true, childList: true };

            ReactDOM.render(<ModelWrappedComponent cq_model_path={CHILD10_PATH}/>, rootNode);

            // Expect child10 path & value.
            observer = getContentPathAndValueObserver(CHILD10_PATH, CHILD10_VALUE, INNER_COMPONENT_ID, step2);
            observer.observe(rootNode, config);

            function step2() {
                observer.disconnect();
                // Produce an update instead of a replacement
                ReactDOM.render(<ModelWrappedComponent now={Date.now()}/>, rootNode);

                // Path prop removed - Expect no path and no value.
                observer = getContentPathAndValueObserver('', NO_VALUE, INNER_COMPONENT_ID, done);
                observer.observe(rootNode, config);
            }
        });

        it('should return a component wrapped in a model provider - MapTo', done => {
            let config = { attributes: true, subtree: true, childList: true };

            const ExportedTestComponent = MapTo(TEST_COMPONENT_RESOURCE_TYPE)(TestComponent, EditConfig);

            ReactDOM.render(<ExportedTestComponent cq_model_path={CHILD10_PATH}/>, rootNode);

            // Expect child10 path & value.
            observer = getContentPathAndValueObserver(CHILD10_PATH, CHILD10_VALUE, INNER_COMPONENT_ID, step2);
            observer.observe(rootNode, config);

            function step2() {
                observer.disconnect();
                // Produce an update instead of a replacement
                ReactDOM.render(<ExportedTestComponent now={Date.now()}/>, rootNode);

                // Path prop removed - Expect no path and no value.
                observer = getContentPathAndValueObserver('', NO_VALUE, INNER_COMPONENT_ID, done);
                observer.observe(rootNode, config);
            }
        });

        it('should update value when path changes', done => {
            let config = { attributes: true, subtree: true, childList: true };

            const ExportedTestComponent = MapTo(TEST_COMPONENT_RESOURCE_TYPE)(TestComponent, EditConfig);

            ReactDOM.render(<ExportedTestComponent cq_model_path={CHILD10_PATH}/>, rootNode);

            // Expect child10 path & value.
            observer = getContentPathAndValueObserver(CHILD10_PATH, CHILD10_VALUE, INNER_COMPONENT_ID, step2);
            observer.observe(rootNode, config);

            function step2() {
                observer.disconnect();
                ReactDOM.render(<ExportedTestComponent cq_model_path={CHILD11_PATH}/>, rootNode);

                // Expect child11 path & value.
                observer = getContentPathAndValueObserver(CHILD11_PATH, CHILD11_VALUE, INNER_COMPONENT_ID, done);
                observer.observe(rootNode, config);
            }
        });

    });

});