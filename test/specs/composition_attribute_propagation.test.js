import {withEditable} from "../../src/components/EditableComponent";
import ReactDOM from "react-dom";
import React, {Component} from "react";
import Utils from "../../src/Utils";
import {withModel} from "../../src/components/ModelProvider";
import {withEditorContext} from "../../src/EditorContext";
import {ModelManager} from "@adobe/cq-spa-page-model-manager";

describe('Composition and attribute propagation ->', () => {

    const ROOT_CLASS_NAME = 'root-class';
    const COMPONENT_RESOURCE_TYPE = '/component/resource/type';
    const COMPONENT_PATH = '/path/to/component';
    const CHILD_COMPONENT_CLASS_NAME = 'child-class';
    const DATA_ATTR_TO_PROPS = 'data-attr-to-props';

    const CQ_PROPS = {
        "cqType": COMPONENT_RESOURCE_TYPE,
        "cqPath": COMPONENT_PATH
    };

    class ChildComponent extends Component {
        render() {
            const attr = {
                [DATA_ATTR_TO_PROPS]: this.props.attrToProps
            };

            return <div id={this.props.id} className={CHILD_COMPONENT_CLASS_NAME} {...attr}/>;
        }
    }

    let rootNode;

    let sandbox = sinon.createSandbox();

    beforeEach(() => {
        rootNode = document.createElement('div');
        rootNode.className = ROOT_CLASS_NAME;
        document.body.appendChild(rootNode);

        sandbox.stub(Utils, 'isInEditor');
        sandbox.stub(ModelManager, 'addListener');
        sandbox.stub(ModelManager, 'getData');
    });

    afterEach(() => {
        sandbox.restore();

        if (rootNode) {
            document.body.appendChild(rootNode);
            rootNode = undefined;
        }
    });

    /**
     * Sets a property on the provided CompositeComponent then updates it
     *
     * @param CompositeComponent
     */
    function testCompositionAttributePropagation(CompositeComponent) {
        ReactDOM.render(<CompositeComponent {...CQ_PROPS} attrToProps={true}/>, rootNode);

        let node = rootNode.querySelector('[' + DATA_ATTR_TO_PROPS + ']');

        expect(node).to.exist;
        expect(node.dataset.attrToProps).to.equal('true');

        // Update the component with new properties
        ReactDOM.render(<CompositeComponent {...CQ_PROPS} attrToProps={false}/>, rootNode);

        node = rootNode.querySelector('[' + DATA_ATTR_TO_PROPS + ']');

        expect(node).to.exist;
        expect(node.dataset.attrToProps).to.equal('false');
    }

    describe('withEditable ->', () => {
        it('should propagate attributes to properties', () => {
            testCompositionAttributePropagation(withEditable(ChildComponent));
        });
    });

    describe('withModel ->', () => {
        it('should propagate attributes to properties', () => {
            testCompositionAttributePropagation(withModel(ChildComponent));
        });
    });

    describe('withEditorContext ->', () => {
        it('should propagate attributes to properties', () => {
            testCompositionAttributePropagation(withEditorContext(ChildComponent));
        });
    });

    describe('withEditorContext + withModel + withEditable ->', () => {
        it('should propagate attributes to properties', () => {
            testCompositionAttributePropagation(withEditorContext(withModel(withEditable(ChildComponent))));
        });
    });
});