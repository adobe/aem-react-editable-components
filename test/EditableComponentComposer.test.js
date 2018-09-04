import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withEmptyPlaceholder, PLACEHOLDER_CLASS_NAME } from '../src/EditableComponentComposer';
import Utils from '../src/Utils';

describe('EditableComponentComposer ->', () => {

    const ROOT_CLASS_NAME = 'root-class';
    const CHILD_COMPONENT_CLASS_NAME = 'child-class';
    const IN_EDITOR_CLASS_NAME = 'in-editor-class';
    const EMPTY_LABEL = 'Empty Label';
    const EMPTY_TEXT_SELECTOR = '[data-emptytext="' + EMPTY_LABEL + '"]';

    let rootNode;

    let sandbox = sinon.createSandbox();

    class ChildComponent extends Component {
        render() {
            const editorClassNames = this.props.isInEditor ? IN_EDITOR_CLASS_NAME : '';

            return <div id={this.props.id} className={CHILD_COMPONENT_CLASS_NAME + ' ' + editorClassNames}></div>
        }
    }

    beforeEach(() => {
        sandbox.stub(Utils, 'isInEditor');
        rootNode = document.createElement('div');
        rootNode.className = ROOT_CLASS_NAME;
        document.body.appendChild(rootNode);
    });

    afterEach(() => {
        sandbox.restore();

        if (rootNode) {
            document.body.appendChild(rootNode);
            rootNode = undefined;
        }
    });

    describe('Component emptiness ->', () => {

        it('should declare the component to be empty', () => {
            const EDIT_CONFIG = {
                isEmpty: function () {
                    return true;
                },
                emptyLabel: EMPTY_LABEL
            };

            Utils.isInEditor.returns(true);

            let EditableComponent = withEmptyPlaceholder(ChildComponent, EDIT_CONFIG);

            ReactDOM.render(<EditableComponent></EditableComponent>, rootNode);

            let node = rootNode.querySelector('.' + PLACEHOLDER_CLASS_NAME + EMPTY_TEXT_SELECTOR);

            expect(node).to.exist;
        });

        it('should declare the component to be empty without providing a label', () => {
            const EDIT_CONFIG = {
                isEmpty: function () {
                    return true;
                }
            };

            Utils.isInEditor.returns(true);

            let EditableComponent = withEmptyPlaceholder(ChildComponent, EDIT_CONFIG);

            ReactDOM.render(<EditableComponent></EditableComponent>, rootNode);

            let node = rootNode.querySelector('.' + PLACEHOLDER_CLASS_NAME + EMPTY_TEXT_SELECTOR);

            expect(node).not.to.exist;

            node = rootNode.querySelector('.' + PLACEHOLDER_CLASS_NAME);

            expect(node).to.exist;
        });

        it('should declare the component not to be empty', () => {
            const EDIT_CONFIG = {
                isEmpty: function () {
                    return false;
                },
                emptyLabel: EMPTY_LABEL
            };

            Utils.isInEditor.returns(true);

            let EditableComponent = withEmptyPlaceholder(ChildComponent, EDIT_CONFIG);

            ReactDOM.render(<EditableComponent></EditableComponent>, rootNode);

            let node = rootNode.querySelector('.' + PLACEHOLDER_CLASS_NAME);

            expect(node).not.to.exist;

            node = rootNode.querySelector('.' + CHILD_COMPONENT_CLASS_NAME);

            expect(node).to.exist;
        });

    });
});
