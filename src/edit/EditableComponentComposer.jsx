/*
 * ADOBE CONFIDENTIAL
 *
 * Copyright 2017 Adobe Systems Incorporated
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Utils from '../Utils';

/**
 * Helper class for composing producing a component that can be authored
 *
 * Higher-Order Component pattern
 *
 * @memberOf edit
 * @private
 */
const EditableComponentComposer = {

    PLACE_HOLDER_CLASS_NAME: 'cq-placeholder',

    DRAG_DROP_REGEX: /cq-dd-([^ ])+/g,

    DRAG_DROP_CLASS_NAME: 'cq-dd-',

    /**
     * Configuration object carrying the authoring capabilities to decorate the associated component
     *
     * @typedef {{}} EditConfig
     * @param {String} [dragDropName]       If defined, adds a specific class name enabling the drag and drop functionality
     * @param {String} emptyLabel           Label to be displayed by the placeholder when the component is empty. Optionally returns an empty text value
     * @param {function} isEmpty            Should the component be considered empty
     */

    /**
     * Decorate the given component with properties carried by the editConfig object
     *
     * @param {Component} WrappedComponent  {@link React.Component} to be rendered
     * @param {EditConfig} editConfig       Configuration object responsible for carrying the authoring capabilities to decorate the wrapped component
     * @returns {CompositePlaceholder}      the wrapping component
     */
    compose: function (WrappedComponent, editConfig) {

        return class CompositePlaceholder extends Component {

            decoratePlaceholder(prevProps, prevState) {
                let element = ReactDOM.findDOMNode(this);

                if (!element) {
                    return;
                }

                // Remove previous drag and drop class names
                element.className = element.className.replace(EditableComponentComposer.DRAG_DROP_REGEX, '');

                if (editConfig.dragDropName && editConfig.dragDropName.trim().length > 0) {
                    element.classList.add(EditableComponentComposer.DRAG_DROP_CLASS_NAME + editConfig.dragDropName);
                }

                if (this.usePlaceholder()) {
                    if (!element.classList.contains(EditableComponentComposer.PLACE_HOLDER_CLASS_NAME)) {
                        element.classList.add(EditableComponentComposer.PLACE_HOLDER_CLASS_NAME);
                    }

                    element.dataset.emptytext = editConfig.emptyLabel;
                    // console.debug('EditableComponentComposer.js', 'set as placeholder', element, prevProps, this.props, this);
                } else {
                    element.classList.remove(EditableComponentComposer.PLACE_HOLDER_CLASS_NAME);
                    delete element.dataset.emptytext;
                    // console.debug('EditableComponentComposer.js', 'set as none placeholder', element, prevProps, this.props, this);
                }
            }

            componentDidUpdate(prevProps, prevState) {
                this.decoratePlaceholder(prevProps, prevState);
            }

            usePlaceholder() {
                return Utils.isInEditor() && editConfig && typeof editConfig.isEmpty === 'function' && editConfig.isEmpty.call(this);
            }

            render() {
                return <WrappedComponent {...this.props}/>;
            }
        }
    }
};

export default EditableComponentComposer;