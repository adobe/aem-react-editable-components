import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { ComponentMapping, MapTo, PageModelManager } from '../../index';

require('../../dist/components/ResponsiveGrid');

describe('ResponsiveGrid', () => {

    const RESPONSIVE_GRID_RESOURCE_TYPE = 'wcm/foundation/components/responsivegrid';
    const TEST_COLUMN_RESOURCE_TYPE = 'test/column/component';
    const RESPONSIVE_GRID_CLASS_NAME = 'aem-Grid';
    const RESPONSIVE_GRID_CLASS_NAMES = RESPONSIVE_GRID_CLASS_NAME + ' aem-Grid--12 aem-Grid--default--12';
    const RESPONSIVE_COLUMN_CLASS_NAME = 'aem-GridColumn';
    const RESPONSIVE_COLUMN_CLASS_NAMES = RESPONSIVE_COLUMN_CLASS_NAME + ' aem-GridColumn--default--12';
    const RESPONSIVE_GRID_PLACEHOLDER_CLASS_NAMES_SELECTOR = '.new.section.aem-Grid-newComponent';
    const ATTRIBUTE_CLASS = 'class';

    const RESPONSIVE_GRID_ID = 'responsiveGridId';

    const RESPONSIVE_GRID_CONTAINER_CLASS_NAME = 'aem-container';

    const RESPONSIVE_COLUMN_MODEL = {
        "columnClassNames": RESPONSIVE_COLUMN_CLASS_NAMES,
        ":type": TEST_COLUMN_RESOURCE_TYPE
    };

    const RESPONSIVE_GRID_MODEL = {
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

    let observerConfig = { attributes: true, subtree: true };

    before(() => {
        let metaEditor = document.createElement('meta');
        metaEditor.setAttribute('property', 'cq:wcmmode');
        metaEditor.setAttribute('content', 'edit');
        document.head.appendChild(metaEditor);
        sinon.stub(PageModelManager, 'getData').withArgs('child01').resolves(RESPONSIVE_COLUMN_MODEL);
    });

    beforeEach(() => {
        MapTo(TEST_COLUMN_RESOURCE_TYPE)(ComponentChild, EditConfig);

        rootNode = document.createElement('div');
        document.body.appendChild(rootNode);

        ResponsiveGrid = ComponentMapping.get(RESPONSIVE_GRID_RESOURCE_TYPE);
    });

    afterEach(() => {
        rootNode.innerHTML = '';
        delete rootNode.dataset.cqEditor;
    });

    after(() => {
        PageModelManager.getData.restore();
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

        it('should have a placeholder', done => {
            ReactDOM.render(<ResponsiveGrid id={RESPONSIVE_GRID_ID} cq_model={RESPONSIVE_GRID_MODEL}/>, rootNode);

            let placeholder = rootNode.querySelector('.' + RESPONSIVE_GRID_CLASS_NAME + ' > ' + RESPONSIVE_GRID_PLACEHOLDER_CLASS_NAMES_SELECTOR);

            if (!placeholder) {
                done(new Error('Placeholder not found'));
                return;
            }

            done();
        });

    });

    describe('column class names ->', () => {

        it('should contain the expected class names', done => {
            let observer;
            let classNames = RESPONSIVE_COLUMN_CLASS_NAMES.split(' ');

            function observe (mutationsList) {
                for(let mutation of mutationsList) {
                    if (mutation.type === 'attributes' && mutation.attributeName === ATTRIBUTE_CLASS && mutation.target.classList.contains(RESPONSIVE_COLUMN_CLASS_NAME)) {
                        classNames.forEach(className => {
                            assert.isTrue(mutation.target.classList.contains(className), 'the Responsive Column doesn\'t contain the expected class names');
                        });

                        observer.disconnect();
                        done();
                        break;
                    }
                }
            }

            observer = new MutationObserver(observe);

            observer.observe(rootNode, observerConfig);

            ReactDOM.render(<ResponsiveGrid id={RESPONSIVE_GRID_ID}/>, rootNode);

            // Provoke update
            ReactDOM.render(<ResponsiveGrid id={RESPONSIVE_GRID_ID} cq_model={RESPONSIVE_GRID_MODEL}/>, rootNode);
        });

    });

});
