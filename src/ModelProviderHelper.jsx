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
 * Helper that facilitate the use of the {@link ModelProvider} component
 * @type {{asModelProvider: (function(*))}}
 */
const ModelProviderHelper = {

    /**
     * Returns a composite component where a {@link ModelProvider} component wraps the provided component
     *
     * @param WrappedComponent
     * @returns {CompositeModelProvider}
     */
    asModelProvider(WrappedComponent) {
        return class CompositeModelProvider extends Component {
            render() {
                return <ModelProvider path={this.props.cq_path}>
                    <WrappedComponent {...this.props}/>
                </ModelProvider>
            }
        }
    }
};

export default ModelProviderHelper;