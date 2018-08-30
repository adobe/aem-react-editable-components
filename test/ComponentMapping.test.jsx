import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { ComponentMapping, MapTo } from '../index';
import { ModelManager } from '@adobe/cq-spa-page-model-manager';

describe('ComponentMapping & EditableComponentComposer', () => {

    const DEFAULT_CONTENT_PATH = window.location.pathname.replace(/\.htm(l)?$/,'');

    const DRAG_DROP_CLASS_NAME = 'cq-dd-';

    const PLACE_HOLDER_CLASS_NAME = 'cq-placeholder';

    const TEST_COMPONENT_RESOURCE_TYPE = 'test/component/resource/type';

    const ATTRIBUTE_CLASS = 'class';

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

    class TestComponent extends Component {
        render () {
            return <div/>
        }
    }

    let WrappedTestComponent;
    let ExportedTestComponent;

    let rootNode;

    let observer;

    let observerConfig = { attributes: true, subtree: true };

    let sandbox = sinon.createSandbox();

    before(() => {
        let metaEditor = document.createElement('meta');
        metaEditor.setAttribute('property', 'cq:wcmmode');
        metaEditor.setAttribute('content', 'edit');
        document.head.appendChild(metaEditor);
    });

    beforeEach(() => {
        sandbox.stub(ModelManager, 'getData')
            .withArgs({path: '', forceReload: undefined}).resolves({})
            .withArgs({path: DEFAULT_CONTENT_PATH, forceReload: undefined}).resolves({});

        ExportedTestComponent = MapTo(TEST_COMPONENT_RESOURCE_TYPE)(TestComponent, EditConfig);

        rootNode = document.createElement('div');
        document.body.appendChild(rootNode);

        WrappedTestComponent = ComponentMapping.get(TEST_COMPONENT_RESOURCE_TYPE);
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

    describe('decoration ->', () => {

        it('should decorate the mapped component with image placeholder class names and empty text attribute', done => {
            let hasPlaceholderClassName = false;
            let hasEmptyText = false;

            function observe (mutationsList) {
                for(let mutation of mutationsList) {
                    hasPlaceholderClassName = mutation.target.classList.contains(PLACE_HOLDER_CLASS_NAME);
                    hasEmptyText = mutation.target.dataset.emptytext === EditConfig.emptyLabel;

                    if (hasPlaceholderClassName && hasEmptyText) {
                        done();
                        break;
                    }
                }
            }

            observer = new MutationObserver(observe);

            observer.observe(rootNode, observerConfig);

            ReactDOM.render(<WrappedTestComponent/>, rootNode);

            // Produce an update instead of a replacement
            ReactDOM.render(<WrappedTestComponent now={Date.now()}/>, rootNode);
        });

        it('should decorate the exported mapped component with image placeholder class names and empty text attribute', done => {
            let hasPlaceholderClassName = false;
            let hasEmptyText = false;

            function observe (mutationsList) {
                for(let mutation of mutationsList) {
                    hasPlaceholderClassName = mutation.target.classList.contains(PLACE_HOLDER_CLASS_NAME);
                    hasEmptyText = mutation.target.dataset.emptytext === EditConfig.emptyLabel;

                    if (hasPlaceholderClassName && hasEmptyText) {
                        done();
                        break;
                    }
                }
            }

            observer = new MutationObserver(observe);

            observer.observe(rootNode, observerConfig);

            ReactDOM.render(<ExportedTestComponent/>, rootNode);

            // Produce an update instead of a replacement
            ReactDOM.render(<ExportedTestComponent now={Date.now()}/>, rootNode);
        });

    });

});
