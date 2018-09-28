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
import Constants from "../Constants";
import isEqual from "react-fast-compare";

/**
 * Class name used to identify the placeholder used to represent an empty component
 *
 * @private
 */
const PLACEHOLDER_CLASS_NAME = 'cq-placeholder';

/**
 * The EditableComponent extends components with editing capabilities
 */
class EditableComponent extends Component {

    constructor(props) {
        super(props);

        this.state = this.propsToState(props);
    }

    propsToState(props) {
        // Keep private properties from being passed as state
        // eslint-disable-next-line no-unused-vars
        const { wrappedComponent, containerProps, editConfig, ...state } = props;

        return state;

    }

    componentDidUpdate(prevProps) {
        if (!isEqual(prevProps, this.props)) {
            this.setState(this.propsToState(this.props));
        }
    }

    /**
     * Properties related to the edition of the component
     */
    get editProps() {
        let eProps = {};

        if (!this.props.isInEditor) {
            return eProps;
        }

        eProps[Constants.DATA_PATH_ATTR] = this.props.cqPath;

        return eProps;
    }

    /**
     * HTMLElement representing the empty placeholder
     * @return {*}
     */
    get emptyPlaceholderProps() {
        if (!this.useEmptyPlaceholder()) {
            return;
        }

        return {
            "data-emptytext": this.props.editConfig.emptyLabel,
            className: PLACEHOLDER_CLASS_NAME
        };
    }

    /**
     * Should an empty placeholder be added
     *
     * @return {boolean}
     */
    useEmptyPlaceholder() {
        return this.props.isInEditor && this.props.editConfig && typeof this.props.editConfig.isEmpty === 'function' && this.props.editConfig.isEmpty(this.props);
    }

    render() {
        let WrappedComponent = this.props.wrappedComponent;

        return <div {...this.editProps} {...this.props.containerProps}>
                <WrappedComponent {...this.state}/>
                <div {...this.emptyPlaceholderProps}/>
            </div>;
    }
}

/**
 * Configuration object of the withEditable function
 *
 * @typedef {Object} EditConfig
 * @property {boolean} [emptyLabel] - Label to be displayed on the overlay when the component is empty
 * @property {function} [isEmpty] - Callback function to determine if the component is empty
 */

/**
 * Returns a composition that provides edition capabilities to the component
 *
 * @param {React.Component} WrappedComponent
 * @param {EditConfig} [editConfig]
 */
function withEditable(WrappedComponent, editConfig) {

    /**
     * Wrapping Editable Component
     */
    return class CompositeEditableComponent extends Component {

        render() {
            return <EditableComponent {...this.props} editConfig={editConfig} wrappedComponent={WrappedComponent}/>
        }
    }
}

export { withEditable, PLACEHOLDER_CLASS_NAME };