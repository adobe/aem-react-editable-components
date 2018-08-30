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
import React, { Component } from "react";
import { ModelManager } from "@adobe/cq-spa-page-model-manager";

export class ModelProvider extends Component {

    constructor(props) {
        super(props);

        // Keep private properties from being passed as state
        // eslint-disable-next-line no-unused-vars
        const { wrappedComponent, cqForceReload, ...localStates } = props;

        this.state = localStates;
    }

    updateData() {
        ModelManager.getData({path: this.props.cqPath, forceReload: this.props.cqForceReload}).then((data) => {
            this.setState(data);
        });
    }

    componentDidMount() {
        ModelManager.addListener(this.props.cqPath, this.updateData.bind(this));
    }

    componentWillUnmount() {
        // Clean up listener
        ModelManager.removeListener(this.props.cqPath, this.updateData.bind(this));
    }

    render() {
        let WrappedComponent = this.props.wrappedComponent;
        return (<WrappedComponent {...this.state}/>)
    }
}

 export const withModel = function(WrappedComponent, config) {

    /**
     * @type CompositeModelProvider
     */
    return class CompositeModelProvider extends Component {
        render() {
            config = config || {};
            // The reload can be forced either via the withModel function property or locally via the tag's property
            const forceReload = this.props.cqForceReload || config.forceReload;
            return (<ModelProvider { ...this.props } cqForceReload={forceReload} wrappedComponent={ WrappedComponent }/>)
        }
    }
};
