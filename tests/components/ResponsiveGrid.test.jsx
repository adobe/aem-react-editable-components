import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { ComponentMapping, MapTo } from '../../index';

require('../../dist/components/ResponsiveGrid');

describe('ResponsiveGrid', () => {

    const RESPONSIVE_GRID_RESOURCE_TYPE = 'wcm/foundation/components/responsivegrid';
    const TEST_COLUMN_RESOURCE_TYPE = 'test/column/component';
    const RESPONSIVE_GRID_CLASS_NAME = 'aem-Grid';
    const RESPONSIVE_GRID_CLASS_NAMES = RESPONSIVE_GRID_CLASS_NAME + ' aem-Grid aem-Grid--12 aem-Grid--default--12';
    const RESPONSIVE_COLUMN_CLASS_NAME = 'aem-GridColumn';
    const RESPONSIVE_COLUMN_CLASS_NAMES = RESPONSIVE_COLUMN_CLASS_NAME + ' aem-GridColumn--default--12';
    const RESPONSIVE_GRID_PLACEHOLDER_CLASS_NAMES_SELECTOR = '.new.section.aem-Grid-newComponent';

    const RESPONSIVE_GRID_ID = 'responsiveGridId';

    const RESPONSIVE_GRID_CONTAINER_CLASS_NAME = 'aem-container';

    const RESPONSIVE_GRID_MODEL = {
        "gridClassNames": RESPONSIVE_GRID_CLASS_NAMES,
        "columnCount": 12,
        ":itemsOrder": ["child01"],
        ":items": {
            "columnClassNames": RESPONSIVE_COLUMN_CLASS_NAMES,
            "child01": {":type": TEST_COLUMN_RESOURCE_TYPE}
        },
        ":type": "wcm/foundation/components/responsivegrid"
    };

    class ComponentChild extends Component {

        render() {
            return <div/>;
        }
    }

    MapTo(TEST_COLUMN_RESOURCE_TYPE, ComponentChild);

    let ResponsiveGrid;

    let rootNode;

    let observerConfig = { attributes: true, subtree: true };

    beforeEach(() => {
        rootNode = document.createElement('div');
        document.body.appendChild(rootNode);

        ResponsiveGrid = ComponentMapping.get(RESPONSIVE_GRID_RESOURCE_TYPE);
    });

    afterEach(() => {
        rootNode.innerHTML = '';
        delete rootNode.dataset.cqEditor;
    });

    describe('grid class names ->', () => {

        it('should contain the expected class names', done => {
            let classNames = RESPONSIVE_GRID_CLASS_NAMES.split(' ');

            ReactDOM.render(<ResponsiveGrid id={RESPONSIVE_GRID_ID} cq_model={RESPONSIVE_GRID_MODEL}/>, rootNode);

            let responsiveNode = rootNode.querySelector('.' + RESPONSIVE_GRID_CONTAINER_CLASS_NAME);

            if (!responsiveNode) {
                done(false, 'Responsive Grid element not found');
            }

            let innerResponsiveGrid = responsiveNode.querySelector('.' + RESPONSIVE_GRID_CLASS_NAME);

            if (!innerResponsiveGrid) {
                done(false, 'Responsive Grid inner element not found');
            }

            classNames.forEach(className => {
                assert.isTrue(innerResponsiveGrid.classList.contains(className), 'the Responsive Grid doesn\'t contain the expected class names');
            });

            done();
        });

    });

    describe('placeholder ->', () => {

        it('should have a placeholder', done => {
            rootNode.dataset.cqEditor = true;

            ReactDOM.render(<ResponsiveGrid id={RESPONSIVE_GRID_ID} cq_model={RESPONSIVE_GRID_MODEL}/>, rootNode);

            let placeholder = rootNode.querySelector('.' + RESPONSIVE_GRID_CLASS_NAME + ' > ' + RESPONSIVE_GRID_PLACEHOLDER_CLASS_NAMES_SELECTOR);

            if (!placeholder || placeholder.length !== 1) {
                done(false, 'Wrong number of placeholders: ' + (placeholder ? placeholder.length : 0));
            }

            done();
        });

    });

    describe('column class names ->', () => {

        it('should contain the expected class names', done => {
            let classNames = RESPONSIVE_COLUMN_CLASS_NAMES.split(' ');

            ReactDOM.render(<ResponsiveGrid id={RESPONSIVE_GRID_ID} cq_model={RESPONSIVE_GRID_MODEL}/>, rootNode);

            let responsiveNode = rootNode.querySelector('.' + RESPONSIVE_GRID_CONTAINER_CLASS_NAME);

            if (!responsiveNode) {
                done(false, 'Responsive Grid element not found');
            }

            let responsiveColumn = responsiveNode.querySelector('.' + RESPONSIVE_COLUMN_CLASS_NAME);

            if (!responsiveColumn) {
                done(false, 'Responsive Column element not found');
            }

            classNames.forEach(className => {
                assert.isTrue(responsiveColumn.classList.contains(className), 'the Responsive Column doesn\'t contain the expected class names');
            });

            done();
        });

    });

});
