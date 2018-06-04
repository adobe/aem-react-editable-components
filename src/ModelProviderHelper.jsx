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
import React, { Component } from 'react';
import ModelProvider from "./components/ModelProvider";

/**
 * Composition class that wraps the provided component and decorating it with a ModelProvider.
 * This class is used internally by the {@link ModelProviderHelper#withModel} function to wrap the provided component into a {@link ModelProvider} component
 *
 * @typedef {{}} CompositeModelProvider
 * @class
 * @extends React.Component
 * @memberOf ModelProviderHelper
 *
 * @property {{}} props                               - the provided component properties
 * @property {string} props.cqModelDataPath        - relative path of the current configuration in the overall page model
 * @property {string} props.cqModelPagePath        - absolute path of the containing page
 * @property {boolean} props.cqModelForceReload    - should the cache be ignored
 */

/**
 * Helper that facilitates the use of the {@link ModelProvider} component
 *
 * @module
 * @type {Object}
 * @namespace ModelProviderHelper
 *
 * @param {function} withModel
 */
const ModelProviderHelper = {

    /**
     * Returns a composite component where a {@link ModelProvider} component wraps the provided component
     *
     * @type {Function}
     * @param {React.Component} WrappedComponent            - component to be wrapped
     * @param {{}} [config]                                 - configuration object
     * @param {boolean} [config.forceReload=undefined]      - should the model cache be ignored when processing the component
     * @returns {CompositeModelProvider}                    - the wrapped component
     */
    withModel(WrappedComponent, config) {

        /**
         * @type CompositeModelProvider
         */
        return class CompositeModelProvider extends Component {
            render() {
                config = config || {};
                // The reload can be forced either via the withModel function property or locally via the tag's property
                let forceReload = this.props.cqModelForceReload || config.forceReload;

                return <ModelProvider dataPath={this.props.cqModelDataPath} pagePath={this.props.cqModelPagePath} forceReload={forceReload}>
                    <WrappedComponent {...this.props}/>
                </ModelProvider>
            }
        }
    }
};

export default ModelProviderHelper;