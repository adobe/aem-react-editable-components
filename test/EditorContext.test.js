import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { EditorContext, withEditorContext } from '../src/EditorContext';

describe('EditorContext ->', () => {

    const ROOT_CLASS_NAME = 'root-class';
    const CHILD_COMPONENT_CLASS_NAME = 'child-class';
    const IN_EDITOR_CLASS_NAME = 'in-editor-class';

    let rootNode;

    let sandbox = sinon.createSandbox();

    let EditorContextComponent;

    class ChildComponent extends Component {
        render() {
            const editorClassNames = this.props.isInEditor ? IN_EDITOR_CLASS_NAME : '';

            return <div id={this.props.id} className={CHILD_COMPONENT_CLASS_NAME + ' ' + editorClassNames}></div>
        }
    }

    beforeEach(() => {
        EditorContextComponent = withEditorContext(ChildComponent);

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

    describe('Provider/Consumer ->', () => {

        it('should propagate its value - true', () => {
            ReactDOM.render(<EditorContext.Provider value={ true }><EditorContextComponent></EditorContextComponent></EditorContext.Provider>, rootNode);

            let childItem = rootNode.querySelector('.' + IN_EDITOR_CLASS_NAME);

            expect(childItem).to.exist;
        });

        it('should propagate its value - false', () => {
            ReactDOM.render(<EditorContext.Provider value={ false }><EditorContextComponent></EditorContextComponent></EditorContext.Provider>, rootNode);

            let childItem = rootNode.querySelector('.' + IN_EDITOR_CLASS_NAME);

            expect(childItem).not.to.exist;
        });

    });
});
