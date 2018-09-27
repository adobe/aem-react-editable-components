import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { EditableComponent, PLACEHOLDER_CLASS_NAME } from '../src/components/EditableComponent';
import Utils from '../src/Utils';
import { ModelManager } from '@adobe/cq-spa-page-model-manager';
import { MapTo } from "../src/ComponentMapping";

describe('EditableComponent ->', () => {

    const ROOT_CLASS_NAME = 'root-class';
    const COMPONENT_RESOURCE_TYPE = '/component/resource/type';
    const COMPONENT_PATH = '/path/to/component';
    const CHILD_COMPONENT_CLASS_NAME = 'child-class';
    const IN_EDITOR_CLASS_NAME = 'in-editor-class';
    const EMPTY_LABEL = 'Empty Label';
    const EMPTY_TEXT_SELECTOR = '[data-emptytext="' + EMPTY_LABEL + '"]';
    const DATA_PATH_ATTRIBUTE_SELECTOR = '[data-cq-data-path="' + COMPONENT_PATH + '"]';

    const props = {
        "cqType": COMPONENT_RESOURCE_TYPE,
        "cqPath": COMPONENT_PATH
    };

    let rootNode;

    let sandbox = sinon.createSandbox();

    class ChildComponent extends Component {
        render() {
            const editorClassNames = this.props.isInEditor ? IN_EDITOR_CLASS_NAME : '';

            return <div id={this.props.id} className={CHILD_COMPONENT_CLASS_NAME + ' ' + editorClassNames}/>;
        }
    }

    beforeEach(() => {
        rootNode = document.createElement('div');
        rootNode.className = ROOT_CLASS_NAME;
        document.body.appendChild(rootNode);

        sandbox.stub(Utils, 'isInEditor');
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

            MapTo(COMPONENT_RESOURCE_TYPE)(ChildComponent, EDIT_CONFIG);

            ReactDOM.render(<EditableComponent isInEditor={true} {...props}><ChildComponent {...props}/></EditableComponent>, rootNode);

            let node = rootNode.querySelector(DATA_PATH_ATTRIBUTE_SELECTOR + ' .' + CHILD_COMPONENT_CLASS_NAME + ' + .' + PLACEHOLDER_CLASS_NAME + EMPTY_TEXT_SELECTOR);

            expect(node).to.exist;
        });

        it('should declare the component to be empty without providing a label', () => {
            const EDIT_CONFIG = {
                isEmpty: function () {
                    return true;
                }
            };

            Utils.isInEditor.returns(true);

            MapTo(COMPONENT_RESOURCE_TYPE)(ChildComponent, EDIT_CONFIG);

            ReactDOM.render(<EditableComponent isInEditor={true} {...props}><ChildComponent {...props}/></EditableComponent>, rootNode);

            let node = rootNode.querySelector(DATA_PATH_ATTRIBUTE_SELECTOR + ' .' + PLACEHOLDER_CLASS_NAME + EMPTY_TEXT_SELECTOR);

            expect(node).not.to.exist;

            node = rootNode.querySelector(DATA_PATH_ATTRIBUTE_SELECTOR + ' .' + CHILD_COMPONENT_CLASS_NAME + ' + .' + PLACEHOLDER_CLASS_NAME);

            expect(node).to.exist;
        });

        it('should declare the component as not being in the editor', () => {
            const EDIT_CONFIG = {
                isEmpty: function () {
                    return true;
                }
            };

            Utils.isInEditor.returns(true);

            MapTo(COMPONENT_RESOURCE_TYPE)(ChildComponent, EDIT_CONFIG);

            ReactDOM.render(<EditableComponent isInEditor={false} {...props}><ChildComponent {...props}/></EditableComponent>, rootNode);

            let node = rootNode.querySelector('.' + PLACEHOLDER_CLASS_NAME + EMPTY_TEXT_SELECTOR);

            expect(node).not.to.exist;

            node = rootNode.querySelector(DATA_PATH_ATTRIBUTE_SELECTOR + ' .' + CHILD_COMPONENT_CLASS_NAME + ' + .' + PLACEHOLDER_CLASS_NAME);

            expect(node).not.to.exist;
        });

        it('should declare the component not to be empty', () => {
            const EDIT_CONFIG = {
                isEmpty: function () {
                    return false;
                },
                emptyLabel: EMPTY_LABEL
            };

            MapTo(COMPONENT_RESOURCE_TYPE)(ChildComponent, EDIT_CONFIG);

            ReactDOM.render(<EditableComponent isInEditor={true} {...props}><ChildComponent {...props}/></EditableComponent>, rootNode);

            let node = rootNode.querySelector('.' + CHILD_COMPONENT_CLASS_NAME + ' + .' + PLACEHOLDER_CLASS_NAME);

            expect(node).not.to.exist;

            node = rootNode.querySelector(DATA_PATH_ATTRIBUTE_SELECTOR + ' .' + CHILD_COMPONENT_CLASS_NAME);

            expect(node).to.exist;
        });

    });
});
