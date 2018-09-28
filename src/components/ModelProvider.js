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
import Utils from "../Utils";
import isEqual from "react-fast-compare";

/**
 * Wraps a portion of the page model into a Component.
 *
 * Fetches content from AEM (using ModelManager) and inject it into the passed React Component.
 */
export class ModelProvider extends Component {

    constructor(props) {
        super(props);

        this.state = this.propsToState(props);
    }

    propsToState(props) {
        // Keep private properties from being passed as state
        // eslint-disable-next-line no-unused-vars
        const { wrappedComponent, cqForceReload, ...state } = props;

        return state;

    }

    componentDidUpdate(prevProps) {
        if (!isEqual(prevProps, this.props)) {
            this.setState(this.propsToState(this.props));
        }
    }

    updateData() {
        ModelManager.getData({path: this.props.cqPath, forceReload: this.props.cqForceReload}).then((data) => {
            this.setState(Utils.modelToProps(data));
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

/**
 * Configuration object of the withModel function
 *
 * @typedef {Object} ModelConfig
 * @property {boolean} [forceReload] - Should the model be refreshed all the time
 */

/**
 *
 * @param WrappedComponent
 * @param {ModelConfig} modelConfig
 * @return {{new(): CompositeModelProvider, prototype: CompositeModelProvider}}
 */
export const withModel = function(WrappedComponent, modelConfig) {

    /**
     * @type CompositeModelProvider
     */
    return class CompositeModelProvider extends Component {
        render() {
            modelConfig = modelConfig || {};
            // The reload can be forced either via the withModel function property or locally via the tag's property
            const forceReload = this.props.cqForceReload || modelConfig.forceReload;
            return (<ModelProvider { ...this.props } cqForceReload={forceReload} wrappedComponent={ WrappedComponent }/>)
        }
    }
};