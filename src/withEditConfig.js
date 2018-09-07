/*
 * ADOBE CONFIDENTIAL
 *
 * Copyright 2018 Adobe Systems Incorporated
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
import Utils from './Utils';

/**
 * Configuration object in charge of providing the necessary data expected by the page editor to initiate the authoring. The provided data will be decorating the associated component
 *
 * @typedef {{}} EditConfig
  * @property {String} emptyLabel           Label to be displayed by the placeholder when the component is empty. Optionally returns an empty text value
 * @property {function} isEmpty            Should the component be considered empty. The function is called using the context of the wrapper component giving you access to the component model
 */

/**
 * Helper class for composing producing a component that can be authored
 *
 * Higher-Order Component pattern
 *
 * @private
 */
const PLACEHOLDER_CLASS_NAME = 'cq-placeholder';


    /**
     * Wrapped the HTMLNodeElement of the given component with properties carried by the editConfig object.
     *
     * @param {React.Component} WrappedComponent    {@link React.Component} to be rendered
     * @param {EditConfig} editConfig               Configuration object responsible for carrying the authoring capabilities to decorate the wrapped component
     * @returns {CompositePlaceholder}              the wrapping component
     */
const withEditConfig = function (WrappedComponent, editConfig) {

    return class CompositePlaceholder extends Component {

        decoratePlaceholder() {
            // eslint-disable-next-line react/no-find-dom-node
            let element = ReactDOM.findDOMNode(this);

            if (!element) {
                return;
            }

            if (this.usePlaceholder()) {
                element.dataset.emptytext = editConfig.emptyLabel;

                if (!element.classList.contains(PLACEHOLDER_CLASS_NAME)) {
                    element.classList.add(PLACEHOLDER_CLASS_NAME);
                }
            } else {
                element.classList.remove(PLACEHOLDER_CLASS_NAME);
                delete element.dataset.emptytext;
            }
        }

        componentDidUpdate() {
            this.decoratePlaceholder();
        }

        componentDidMount() {
            this.decoratePlaceholder();
        }

        usePlaceholder() {
            return Utils.isInEditor() && editConfig && typeof editConfig.isEmpty === 'function' && editConfig.isEmpty.call(this);
        }

        render() {
            return <WrappedComponent {...this.props}/>;
        }
    }
};

export { withEditConfig, PLACEHOLDER_CLASS_NAME };