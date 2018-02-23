import React from 'react';
import ReactDOM from 'react-dom';
import { ModelProvider, PageModelManager } from '../index';


describe('ModelProvider', () => {

    const STATIC_PAGE_MODEL = 'react-page.json';

    const ROOT_GRID_CLASS_PATH = 'root';
    const DATA_ATTRIBUTE_CONTENT_PATH = 'data-cq-content-path';

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
                            "child0010": {":type": "test/components/componentchild0"},
                            "child0011": {":type": "test/components/componentchild1"}
                        },
                        ":type": "wcm/foundation/components/responsivegrid"
                    },
                    "child0001": {":type": "test/components/componentchild1"}
                },
                ":type": "wcm/foundation/components/responsivegrid"
            }
        },
        ":type": "we-retail-react/components/structure/page"
    };

    const INNER_COMPONENT_ID = 'innerContent';

    let server;

    let rootNode;

    let observerConfig = { attributes: true, subtree: true };

    /**
     * Generic observe function
     *
     * @param {function} condition
     * @param {function} done
     * @returns {Function}
     */
    function observe(condition, done) {
        return function (mutationsList) {
            for (let mutation of mutationsList) {
                if (condition && typeof condition === 'function' && condition(mutation)) {
                    this.disconnect();
                    done();
                    break;
                }
            }
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
        server.restore();
    });

    describe('Tag instantiation ->', () => {

        it('should initialize properly without parameter', done => {
            ReactDOM.render(<ModelProvider><div></div></ModelProvider>, rootNode);

            let observer = new MutationObserver(observe(function (mutation) {
                return mutation.type === 'attributes' && mutation.attributeName === 'data-cq-content-path' && mutation.target.dataset.cqContentPath === '';
            }, done));

            observer.observe(rootNode, observerConfig);
        });

        it('should initialize properly with a path parameter', done => {
            let path = 'root';

            ReactDOM.render(<ModelProvider path={path}><div></div></ModelProvider>, rootNode);

            let observer = new MutationObserver(observe(function (mutation) {
                return mutation.type === 'attributes' && mutation.attributeName === 'data-cq-content-path' && mutation.target.dataset.cqContentPath === path;
            }, done));

            observer.observe(rootNode, observerConfig);
        });

        it('should initialize properly with a key parameter', done => {
            let path = '';

            ReactDOM.render(<ModelProvider key={'test'}><div></div></ModelProvider>, rootNode);

            let observer = new MutationObserver(observe(function (mutation) {
                return mutation.type === 'attributes' && mutation.attributeName === 'data-cq-content-path' && mutation.target.dataset.cqContentPath === path;
            }, done));

            observer.observe(rootNode, observerConfig);
        });

        it('should initialize properly with a path and a key parameter', done => {
            let path = 'root';

            ReactDOM.render(<ModelProvider key={'test'} path={path}><div></div></ModelProvider>, rootNode);

            let observer = new MutationObserver(observe(function (mutation) {
                return mutation.type === 'attributes' && mutation.attributeName === 'data-cq-content-path' && mutation.target.dataset.cqContentPath === path;
            }, done));

            observer.observe(rootNode, observerConfig);
        });

    });

    describe('decoration ->', () => {

        it('should decorate the inner content', done => {
            let node = document.createElement('div');
            let config = { attributes: true, subtree: true, childList: true };

            let observer = new MutationObserver(observe(function (mutation) {
                return mutation.target.id === INNER_COMPONENT_ID && mutation.type === 'attributes' && mutation.attributeName === DATA_ATTRIBUTE_CONTENT_PATH && mutation.target.dataset.cqContentPath === ROOT_GRID_CLASS_PATH;
            }, done));

            observer.observe(node, config);

            let instance = ReactDOM.render(<ModelProvider path={ROOT_GRID_CLASS_PATH}><div id={INNER_COMPONENT_ID}/></ModelProvider>, node);

            expect(instance.props.path).to.equal(ROOT_GRID_CLASS_PATH);
        });

    });

});
