import PageModelManager from '@cq/spa-page-model-manager';
import React from 'react';
import ReactDOM from 'react-dom';
import { ModelProvider } from '../index';

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

    beforeEach(() => {
        server = sinon.fakeServer.create();

        server.respondWith("GET", STATIC_PAGE_MODEL,
            [200, { "Content-Type": "application/json" }, JSON.stringify(PAGE_MODEL_JSON)]);

        PageModelManager.init(STATIC_PAGE_MODEL).then(model => {
            assert.deepEqual(PAGE_MODEL_JSON, model, 'Returns the page model object');
        });

        server.respond();
    });

    afterEach(() => {
        server.restore();
    });

    describe('decoration ->', () => {

        it('should decorate the inner content', done => {
            let observer;
            let node = document.createElement('div');
            let config = { attributes: true, subtree: true, childList: true };

            function observe (mutationsList) {
                for(let mutation of mutationsList) {
                    if (mutation.target.id === INNER_COMPONENT_ID && mutation.type === 'attributes' && mutation.attributeName === DATA_ATTRIBUTE_CONTENT_PATH) {
                        expect(mutation.target.dataset.cqContentPath).to.equal(ROOT_GRID_CLASS_PATH);
                        observer.disconnect();
                        done();
                        break;
                    }
                }
            }

            observer = new MutationObserver(observe);

            observer.observe(node, config);

            let instance = ReactDOM.render(<ModelProvider path={ROOT_GRID_CLASS_PATH}><div id={INNER_COMPONENT_ID}/></ModelProvider>, node);

            expect(instance.props.path).to.equal(ROOT_GRID_CLASS_PATH);
        });

    });

});
