import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {getVerifyObserver, getDataAttributesObserver} from '../Utils';
import { ComponentMapping, MapTo, PageModelManager, Constants } from '../../index';

require('../../dist/components/ResponsiveGrid');

describe('ResponsiveGrid ->', () => {

    const RESPONSIVE_GRID_RESOURCE_TYPE = 'wcm/foundation/components/responsivegrid';
    const TEST_COLUMN_RESOURCE_TYPE = 'test/column/component';
    const WCM_MODE_META_SELECTOR = 'meta[property="cq:wcmmode"]';
    const RESPONSIVE_GRID_CLASS_NAME = 'aem-Grid';
    const RESPONSIVE_GRID_CLASS_NAMES = RESPONSIVE_GRID_CLASS_NAME + ' aem-Grid--12 aem-Grid--default--12';
    const RESPONSIVE_COLUMN_CLASS_NAME = 'aem-GridColumn';
    const RESPONSIVE_COLUMN_CLASS_NAMES = RESPONSIVE_COLUMN_CLASS_NAME + ' aem-GridColumn--default--12';
    const ATTRIBUTE_CLASS = 'class';
    const RESPONSIVE_GRID_MODEL_PATH = 'responsivegrid';
    const CHILD_01_MODEL_PATH = 'responsivegrid/child01';

    const RESPONSIVE_GRID_ID = 'responsiveGridId';

    const RESPONSIVE_GRID_CONTAINER_CLASS_NAME = 'aem-container';

    const RESPONSIVE_COLUMN_MODEL = {
        "columnClassNames": RESPONSIVE_COLUMN_CLASS_NAMES,
        ":type": TEST_COLUMN_RESOURCE_TYPE
    };

    const RESPONSIVE_GRID_MODEL = {
        [Constants.DATA_PATH_PROP]: RESPONSIVE_GRID_MODEL_PATH,
        "gridClassNames": RESPONSIVE_GRID_CLASS_NAMES,
        "columnCount": 12,
        ":itemsOrder": ["child01"],
        ":items": {
            "child01": RESPONSIVE_COLUMN_MODEL
        },
        ":type": "wcm/foundation/components/responsivegrid"
    };

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

    class ComponentChild extends Component {

        render() {
            return <div/>;
        }
    }

    let ResponsiveGrid;

    let rootNode;

    let wcmMeta;

    let observerConfig = { attributes: true, subtree: true };

    let sandbox = sinon.createSandbox();

    beforeEach(() => {
        rootNode = document.createElement('div');
        document.body.appendChild(rootNode);

        wcmMeta = document.head.querySelector(WCM_MODE_META_SELECTOR);

        if (!wcmMeta) {
            wcmMeta = document.createElement('meta');
            wcmMeta.setAttribute('property', 'cq:wcmmode');
            wcmMeta.setAttribute('content', 'edit');
            document.head.appendChild(wcmMeta);
        }

        sandbox.stub(PageModelManager, 'getData').withArgs({pagePath: '', dataPath: CHILD_01_MODEL_PATH, forceReload: undefined}).resolves(RESPONSIVE_COLUMN_MODEL);

        MapTo(TEST_COLUMN_RESOURCE_TYPE)(ComponentChild, EditConfig);

        ResponsiveGrid = ComponentMapping.get(RESPONSIVE_GRID_RESOURCE_TYPE);

    });

    afterEach(() => {
        sandbox.restore();
        document.body.removeChild(rootNode);
        document.head.removeChild(wcmMeta);
        rootNode = null;
        wcmMeta = null;
    });

    describe('grid class names ->', () => {

        it('should contain the expected class names', done => {
            let classNames = RESPONSIVE_GRID_CLASS_NAMES.split(' ');

            ReactDOM.render(<ResponsiveGrid id={RESPONSIVE_GRID_ID} cq_model={RESPONSIVE_GRID_MODEL}/>, rootNode);

            let responsiveNode = rootNode.querySelector('.' + RESPONSIVE_GRID_CONTAINER_CLASS_NAME);

            if (!responsiveNode) {
                done(new Error('Responsive Grid element not found'));
                return;
            }

            let innerResponsiveGrid = responsiveNode.querySelector('.' + RESPONSIVE_GRID_CLASS_NAME);

            if (!innerResponsiveGrid) {
                done(new Error('Responsive Grid inner element not found'));
                return;
            }

            classNames.forEach(className => {
                assert.isTrue(innerResponsiveGrid.classList.contains(className), 'the Responsive Grid doesn\'t contain the expected class names');
            });

            done();
        });

    });

    describe('placeholder ->', () => {

        /**
         * Tests the integrity of the responsive grid placeholder
         *
         * @param {string} wcmMode     - WCM mode in which to test the placeholder
         * @param {{}} attributes      - data attributes to be verified on the target element
         * @param {function} done
         */
        function testPlaceholder(wcmMode, attributes, done) {
            wcmMeta.content = wcmMode;
            let observer = getDataAttributesObserver(attributes, '.new.section.aem-Grid-newComponent', done);

            observer.observe(rootNode, observerConfig);

            ReactDOM.render(<ResponsiveGrid id={RESPONSIVE_GRID_ID}/>, rootNode);

            // Provoke update
            ReactDOM.render(<ResponsiveGrid id={RESPONSIVE_GRID_ID} cq_model={RESPONSIVE_GRID_MODEL}/>, rootNode);
        }

        it('should have a placeholder in WCM edit mode', done => {
            testPlaceholder('edit', {'data-cq-content-path': RESPONSIVE_GRID_MODEL_PATH + '/*'}, done);
        });

        it('should have a placeholder in WCM preview mode', done => {
            testPlaceholder('preview', {'data-cq-content-path': RESPONSIVE_GRID_MODEL_PATH + '/*'}, done);
        });

        it('shouldn\'t have a placeholder', done => {
            testPlaceholder(undefined, {'data-cq-content-path': undefined}, done);
        });
    });

    describe('column class names ->', () => {

        it('should contain the expected class names', done => {
            let classNames = RESPONSIVE_COLUMN_CLASS_NAMES.split(' ');

            let observer = getVerifyObserver(function (mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === ATTRIBUTE_CLASS && mutation.target.classList.contains(RESPONSIVE_COLUMN_CLASS_NAME)) {
                    classNames.forEach(className => {
                        assert.isTrue(mutation.target.classList.contains(className), 'the Responsive Column doesn\'t contain the expected class names');
                    });

                    return true;
                }

                return false;
            }, done);

            observer.observe(rootNode, observerConfig);

            ReactDOM.render(<ResponsiveGrid id={RESPONSIVE_GRID_ID}/>, rootNode);

            // Provoke update
            ReactDOM.render(<ResponsiveGrid id={RESPONSIVE_GRID_ID} cq_model={RESPONSIVE_GRID_MODEL}/>, rootNode);
        });

    });

});
