import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { ComponentMapping, MapTo, edit } from '../index';

describe('ComponentMapping & EditableComponentComposer', () => {

    const DRAG_DROP_CLASS_NAME = 'cq-dd-';

    const PLACE_HOLDER_CLASS_NAME = 'cq-placeholder';

    const TEST_COMPONENT_RESOURCE_TYPE = 'test/component/resource/type';

    const ATTRIBUTE_CLASS = 'class';

    class TestComponent extends Component {
        render () {
            return <div/>
        }
    }

    let WrappedTestComponent;

    let rootNode;

    let observerConfig = { attributes: true, subtree: true };

    beforeEach(() => {
        MapTo(TEST_COMPONENT_RESOURCE_TYPE)(TestComponent, edit.ImageEdit);

        rootNode = document.createElement('div');
        document.body.appendChild(rootNode);

        WrappedTestComponent = ComponentMapping.get(TEST_COMPONENT_RESOURCE_TYPE);
    });

    afterEach(() => {
        rootNode.innerHTML = '';
        delete rootNode.dataset.cqEditor;
    });

    describe('decoration ->', () => {

        it('should decorate the mapped component with drag and drop class names', done => {
            let observer;

            function observe (mutationsList) {
                for(let mutation of mutationsList) {
                    if (mutation.type === 'attributes' && mutation.attributeName === ATTRIBUTE_CLASS) {
                        assert.isTrue(mutation.target.classList.contains(DRAG_DROP_CLASS_NAME + edit.ImageEdit.dragDropName), 'Component not decorated with drag-drop class name');
                        observer.disconnect();
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

        it('should decorate the mapped component with image placeholder class names and empty text attribute', done => {
            let observer;

            rootNode.dataset.cqEditor = true;

            let hasPlaceholderClassName = false;
            let hasEmptyText = false;

            function observe (mutationsList) {
                for(let mutation of mutationsList) {
                    hasPlaceholderClassName = mutation.target.classList.contains(PLACE_HOLDER_CLASS_NAME);
                    hasEmptyText = mutation.target.dataset.emptytext === edit.ImageEdit.emptyLabel;

                    if (hasPlaceholderClassName && hasEmptyText) {
                        observer.disconnect();
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

    });

});
